import { useState, useEffect } from 'react';

export default function useSortGroupMembers(confADMembs, editMembers, isEditting) {
  const [members, setMembers] = useState({
      stable: [],
      newOnes: [],
      deleted: []
  });


  function operation(list1, list2, isUnion) {
    var result = [];

    if(!list1) list1 = []
    if(!list2) list2 = []

    for (var i = 0; i < list1.length; i++) {
        var item1 = list1[i],
        found = false;
    for (var j = 0; j < list2.length && !found; j++) {
        found = item1.sAMAccountName === list2[j].sAMAccountName;
    }
    if (found === !!isUnion) { // isUnion is coerced to boolean
        result.push(item1);
    }
    }
 
    return result;
}

function inBoth(list1, list2) {
    return operation(list1, list2, true);
}

function inFirstOnly(list1, list2) {
    return operation(list1, list2);
}

function inSecondOnly(list1, list2) {
    return inFirstOnly(list2, list1);
}

  useEffect(() => {
      if(isEditting){
            const newStable = inBoth(confADMembs, editMembers)
            const newDeleted = inFirstOnly(confADMembs, editMembers)
            const newNewOnes = inSecondOnly(confADMembs, editMembers)
            console.log("newStable: ", newStable)
            console.log("newDeleted: ", newDeleted)
            console.log("newNewOnes: ", newNewOnes)
            setMembers({stable: newStable, deleted: newDeleted, newOnes: newNewOnes})
      } else{
            setMembers(prev => { return { ...prev ,stable: confADMembs}})
      }

    return () => {
      //ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
    };
  }, [confADMembs, editMembers, isEditting] );

  return {stable: members.stable , newOnes: members.newOnes, deleted: members.deleted};
}