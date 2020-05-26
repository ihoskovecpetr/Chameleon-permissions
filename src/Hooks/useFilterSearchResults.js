import { useState, useEffect } from 'react';
import Fuse from 'fuse.js';

export default function useFilterSearchPeople(projects, searchText) {
  const [filtered, setFiltered] = useState([{id: 1}]);


  useEffect(() => {

    const fuse = new Fuse(projects, {
      keys: ['K2client', 'K2name'],
      includeMatches: true
    })

    var results = fuse.search(searchText)

    setFiltered(results)
    
  }, [projects, searchText] );

  console.log("useFilterSearchPeople: projects, filtered ", projects, filtered)


  return filtered;
}