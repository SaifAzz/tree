import React, { useState } from 'react';
import CustomBox from './CustomBox';
import '../styles.css';
import DefaultParentNode from './ParentDefaultBox';

const TreeNode = ({ node, childrenData, path = [] }) => {
  const [expandChildrenNodes, setExpandChildrenNodes] = useState(true);
  const [displayedCount, setDisplayedCount] = useState(10);
  const [fetchedData, setFetchedData] = useState({});
  const shouldScroll = childrenData?.mens?.length > displayedCount;

  const handleNodeClick = () => {
    // Reset everything and collapse all nodes
    setExpandChildrenNodes(!expandChildrenNodes);
    setFetchedData({});
  };

  const handleLoadMore = () => {
    setDisplayedCount((prevCount) => prevCount + 20);
  };

  const handleChildClick = async (child) => {
    try {
      // Construct the full path including the current child
      const fullPath = [...path, child.name];

      // Toggle the expansion state for the clicked child
      setFetchedData((prev) => ({
        [child.name]: {
          ...prev[child.name],
          expanded: !prev[child.name]?.expanded,
        }
      }));
      setExpandChildrenNodes(true);  // Ensure children nodes section is expanded

      // Fetch data only if it hasn't been fetched already
      if (!fetchedData[child.name]?.data) {
        const response = await fetch('https://cca9-2001-9e8-65cd-1800-d4b3-f4e4-1548-7514.ngrok-free.app/developer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            path: fullPath, // Send the full path in the request
            mens: [{ name: child.name }]
          }),
        });

        if (!response.ok) throw new Error('Failed to fetch data');

        const data = await response.json();

        // Save fetched data and set the new child as expanded
        setFetchedData((prev) => ({
          ...prev,
          [child.name]: { data, expanded: true }
        }));
      }
    } catch (error) {
      console.error('Error fetching child data:', error);
    }
  };

  return (
    <li style={{ width: '100%' }}>
      {node.name === 'Leader' && (
        <DefaultParentNode childNode={node} onClick={handleNodeClick} />
      )}
      {expandChildrenNodes && (
        <ul className={`child-nodes ${shouldScroll ? 'scrollable' : ''}`}>
          {childrenData?.mens?.slice(0, displayedCount).map((child, index) => (
            <li key={index}>
              <CustomBox childNode={child} onClick={() => handleChildClick(child)} />
              {fetchedData[child.name]?.expanded && (
                <TreeNode
                  node={child}
                  childrenData={fetchedData[child.name]?.data}
                  path={[...path, child.name]}
                />
              )}
            </li>
          ))}
          {displayedCount < childrenData?.mens?.length && (
            <li>
              <button onClick={handleLoadMore} className="load-more-button">
                Load More
              </button>
            </li>
          )}
        </ul>
      )}
    </li>
  );
};

export default TreeNode;
