import { useState, useEffect } from 'react';

export default function useFormateK2Object(projects) {
  const [formatedProjects, setFormatedProjects] = useState(["Formatovano"]);



  useEffect(() => {
    
    const newFormatingArr = projects.map(project => {
      if(project.K2name){
        return project
      }else{
        return {...project,
          "K2rid": project.K2.rid,
          "K2client": project.K2.client,
          "K2name": project.K2.name,
          "K2projectId": project.K2.projectId,
          }
      }
    })

    setFormatedProjects(newFormatingArr)

    return () => {
      //ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
    };
  }, [projects] );

  return formatedProjects;
}