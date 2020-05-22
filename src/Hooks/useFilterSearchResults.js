import { useState, useEffect } from 'react';
import Fuse from 'fuse.js';

export default function useFilterSearchPeople(projects, searchText) {
  const [filtered, setFiltered] = useState([{id: 1}]);



  useEffect(() => {

    const fuse = new Fuse(projects, {
      keys: ['K2client', 'K2name'],
      includeMatches: true
    })

    console.log("Searching by this:  ef : ", searchText)
    // if(searchText){
    var results = fuse.search(searchText)
    // }else{
    //  var results = projects
    // }

    console.log("useFilterSreach ef : ", results)

    setFiltered(results)
    
    return () => {
      //ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
    };
  }, [projects, searchText] );

  return filtered;
}