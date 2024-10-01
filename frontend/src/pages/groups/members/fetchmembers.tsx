// src/hooks/useFetchMembers.tsx

import { useEffect, useState } from "react";
import axios from "axios";

// Define interfaces for your members and response data
interface Member {
  _id: any;
  name: string;
  email: string;
  username: string;
}

interface FetchMembersResponse {
  members: Member[];
  admins: Member[];
}

const useFetchMembers = (groupId: string) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [admins, setAdmins] = useState<Member[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null); // To hold any error message

  useEffect(() => {
    const fetchMembers = async () => {
      const id = localStorage.getItem("id"); // Assuming 'id' is the current user's ID
      if (!id) {
        setError("User ID not found in local storage.");
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get<FetchMembersResponse>(
          `${import.meta.env.VITE_BACKEND_URL}/api/${groupId}/${id}/members`
        );
        // Destructure members and admins from the response
        const { members, admins } = response.data;
        setMembers(members);
        setAdmins(admins);
        console.log(members, admins); // Debugging response structure
      } catch (error) {
        console.error("Error fetching members:", error);
        setError("Failed to fetch members. Please try again later."); // Set error message
      } finally {
        setLoading(false);
      }
    };

    if (groupId) {
      fetchMembers();
    }
  }, [groupId]);

  return { members, admins, loading, error }; // Return admins and error state
};

export default useFetchMembers;
