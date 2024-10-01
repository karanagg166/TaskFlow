// src/components/MembersPage.tsx

import React from 'react';
import { Typography, Card, CardContent, Pagination } from '@mui/material';
import useFetchMembers from './fetchmembers'; // Import the custom hook
import { useParams } from 'react-router-dom'; // Import useParams to get groupId

const MembersPage: React.FC = () => {
    const { groupId } = useParams<{ groupId: string }>(); // Retrieve groupId from URL
    const { members, admins, loading, error } = useFetchMembers(groupId!); // Use the custom hook with groupId
    const [currentPage, setCurrentPage] = React.useState<number>(1);
    const membersPerPage = 7;

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>; // Display error if it exists
    }

    // Define the Member interface directly here
    interface Member {
        username: string;
        _id: string;
        name: string;
        email: string;
    }

    // Combine admins and members for display
    const combinedMembers: Member[] = [...admins, ...members];
    const indexOfLastMember = currentPage * membersPerPage;
    const indexOfFirstMember = indexOfLastMember - membersPerPage;
    const currentMembers = combinedMembers.slice(indexOfFirstMember, indexOfLastMember);

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value);
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen mt-30" style={{ paddingTop: "200px" }}>
      {/* Add margin-top for space */}
            <Typography variant="h4" className="font-bold text-blue-800 mb-4">Group Members</Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentMembers.map((member) => (
                    <Card key={member._id} className="shadow-md transition-transform transform hover:scale-105">
                        <CardContent>
                            <Typography variant="h6" className="text-blue-600">Name : {member.name}</Typography>
                            <Typography variant="body2" className="text-gray-600">Email : {member.email}</Typography>
                            <Typography variant="body2" className="text-gray-600">Username : {member.username}</Typography>
                            <Typography variant="body2" className="text-gray-600">
                                {admins.some(admin => admin._id === member._id) ? 'Admin' : 'Member'}
                            </Typography> {/* Display Admin or Member */}
                        </CardContent>
                    </Card>
                ))}
            </div>
            <Pagination
                count={Math.ceil(combinedMembers.length / membersPerPage)}
                page={currentPage}
                onChange={handlePageChange}
                className="mt-6"
                color="primary"
            />
        </div>
    );
};

export default MembersPage;
