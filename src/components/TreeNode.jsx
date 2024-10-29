import React, { useState } from 'react';
import CustomBox from './CustomBox';
import '../styles.css';
import DefaultParentNode from './ParentDefaultBox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';

const TreeNode = ({ node, childrenData, path = [] }) => {
  const [expandChildrenNodes, setExpandChildrenNodes] = useState(true);
  const [displayedCount, setDisplayedCount] = useState(10);
  const [fetchedData, setFetchedData] = useState({});
  const shouldScroll = childrenData?.mens?.length > displayedCount;

  const handleNodeClick = () => {
    setExpandChildrenNodes((prev) => !prev);
  };

  const handleLoadMore = () => {
    setDisplayedCount((prevCount) => prevCount + 20);
  };

  const handleChildClick = async (child) => {
    const newPath = [...path, child.name]; // Append current child name to path

    try {
      // Close all expanded nodes before expanding the new one
      setFetchedData((prev) =>
        Object.fromEntries(
          Object.entries(prev).map(([key, value]) => [key, { ...value, expanded: false }])
        )
      );

      if (!fetchedData[child.name]) {
        // Fetch data if it hasn't been fetched already
        const response = await fetch('https://cca9-2001-9e8-65cd-1800-d4b3-f4e4-1548-7514.ngrok-free.app/developer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            path: newPath, // Send the full path in the request
            mens: [{ name: child.name }]
          }),
        });

        if (!response.ok) throw new Error('Failed to fetch data');

        const data = await response.json();
        
        // Initialize the new child with expanded: true
        setFetchedData((prev) => ({
          ...prev,
          [child.name]: { data, expanded: true }
        }));
        console.log(`Fetched data for ${child.name} with path ${newPath}:`, data);
      } else {
        // Toggle expanded state for the clicked child node
        setFetchedData((prev) => ({
          ...prev,
          [child.name]: {
            ...prev[child.name],
            expanded: !prev[child.name].expanded,
          }
        }));
      }
    } catch (error) {
      console.error('Error fetching child data:', error);
    }
  };

  return (
    <li style={{ width: '100%' }}>
      {node.name === 'Leader' && <DefaultParentNode childNode={node} onClick={() => handleNodeClick()} />}
      {expandChildrenNodes && (
        <ul className={`child-nodes ${shouldScroll ? 'scrollable' : ''}`}>
          {childrenData?.mens?.slice(0, displayedCount).map((child, index) => (
            <li key={index}>
              <CustomBox childNode={child} onClick={() => handleChildClick(child)} />
              {fetchedData[child.name]?.expanded && (
                <TreeNode
                  node={child}
                  childrenData={fetchedData[child.name]?.data}
                  path={[...path, child.name]} // Pass updated path to child TreeNode
                />
              )}
            </li>
          ))}
          {displayedCount < childrenData?.mens?.length && (
            <li>
              <button onClick={handleLoadMore} className="load-more-button">
                <FontAwesomeIcon icon={faPlusCircle} className="load-more-icon" />
              </button>
            </li>
          )}
        </ul>
      )}
    </li>
  );
};

export default TreeNode;
