import React, { useState } from 'react';
import TreeNode from './TreeNode';

const Tree = ({ data }) => {
  return (
    <div className="tree">
      <ul>
        <TreeNode
          node={{ name: "Leader", number_of_hadiths: 0 }} // Placeholder for leader
          childrenData={data} // Pass the child nodes data here
        />
      </ul>
    </div>
  );
};

export default Tree;
