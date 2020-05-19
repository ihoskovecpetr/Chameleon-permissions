import { useState, useEffect } from 'react';
import Fuse from 'fuse.js';

export default function useSortGroupMembers(projects, searchText) {
  const [filtered, setFiltered] = useState([{id: 1}]);



  useEffect(() => {

    const fuse = new Fuse(projects, {
      keys: ['name'],
      includeMatches: true
    })

    const results = fuse.search(searchText)

    console.log("useFilterPeople ", results)

    setFiltered(results)
    
    return () => {
      //ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
    };
  }, [projects, searchText] );

  return filtered;
}