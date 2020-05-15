import { useState, useEffect } from 'react';
import Fuse from 'fuse.js';

export default function useSortGroupMembers(projects, searchText) {
  const [filtered, setFiltered] = useState([{id: 1}]);



  useEffect(() => {

    const fuse = new Fuse(projects, {
      keys: ['K2client', 'K2name'],
      includeMatches: true
    })

    const results = fuse.search(searchText)

    console.log("useFilterSreach ef : ", results)

    setFiltered(results)
    
    return () => {
      //ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
    };
  }, [projects, searchText] );

  return filtered;
}