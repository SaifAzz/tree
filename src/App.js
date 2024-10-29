import React, { useState } from 'react';
import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Tree from './components/Tree';
import './styles.css';

const queryClient = new QueryClient();

const fetchTreeData = async () => {
  try {
    const response = await fetch('https://cca9-2001-9e8-65cd-1800-d4b3-f4e4-1548-7514.ngrok-free.app/developer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        "mens": []
      }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw new Error('Failed to fetch data');
  }
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: fetchedData = [], error, isLoading } = useQuery({
    queryKey: ['treeData'],
    queryFn: fetchTreeData,
  });

  const filterTree = (nodes, query) => {
    if (!query) return nodes;

    return nodes
      .map(node => {
        const hasMatch =
          node.name.toLowerCase().includes(query.toLowerCase()) ||
          (node.children &&
            filterTree(
              nodes.filter(child => node.children.includes(child.id)),
              query
            ).length > 0);

        if (!hasMatch) {
          return null;
        }

        return {
          ...node,
          children: node.children
            ? filterTree(
                nodes.filter(child => node.children.includes(child.id)),
                query
              )
            : [],
        };
      })
      .filter(node => node !== null);
  };

  const filteredData = filterTree(fetchedData, searchTerm);
  const treeDataToDisplay = searchTerm ? filteredData : fetchedData;

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <div className="app-container">
      <h1>Team Leads and Developers Training Tree</h1>

      <div className="search-box-container">
        <input
          type="text"
          className="search-box"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Tree data={treeDataToDisplay} />
    </div>
  );
};

const Root = () => (
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);

export default Root;
