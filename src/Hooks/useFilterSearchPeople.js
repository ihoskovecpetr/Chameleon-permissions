import { useState, useEffect } from 'react';
import Fuse from 'fuse.js';

export default function useFilterSearchPeople(allPerson, searchText) {
  const [filtered, setFiltered] = useState([{id: 1}]);



  useEffect(() => {

    const fuse = new Fuse(allPerson, {
      keys: ['name'],
      includeMatches: true
    })

    console.log("useFilterPeople srch TXT ", searchText, allPerson)
    
    const results = fuse.search(searchText)

    console.log("useFilterPeople ", results)

    setFiltered(results)
    
    return () => {
      //ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
    };
  }, [allPerson, searchText] );

  return filtered;
}