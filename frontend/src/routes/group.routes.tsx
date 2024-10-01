import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import SideNavbar from '../pages/groups/groupnavbar';
import GroupsPage from '../pages/groups/groups';
import GroupPage from '../pages/groups/grouppage';

import MembersPage from '../pages/groups/members/displaymembers';
import CreateTaskPage from '../pages/groups/tasks/createtaks';
const GroupRoutes: React.FC = () => {
    const location = useLocation(); // Get the current route

    // Condition to check if the current route is '/groups'
    const showSideNavbar = location.pathname !== '/group/groups';

    return (
        <div className="flex">
            {/* Conditionally render SideNavbar based on the route */}
            {showSideNavbar && <SideNavbar />}

            {/* Route content will change based on the URL */}
            <div className={showSideNavbar ? 'flex-grow' : 'flex-grow w-full'}>
                <Routes>
                    <Route path="/groups" element={<GroupsPage />} />
                    <Route path="/:groupId/page" element={<GroupPage />} />
                    <Route path="/:groupId/create_task" element={<CreateTaskPage/>}/>
                    <Route path="/:groupId/members" element={<MembersPage />} />
                    
                </Routes>
            </div>
        </div>
    );
};

export default GroupRoutes;
