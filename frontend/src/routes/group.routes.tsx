// src/routes/GroupRoutes.tsx
import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import SideNavbar from '../pages/groups/groupnavbar';
import GroupsPage from '../pages/groups/groups';
import GroupPage from '../pages/groups/grouppage';
import Navbar from '../components/navbar/navbar';
import MembersPage from '../pages/groups/members/displaymembers';
import CreateTaskPage from '../pages/groups/tasks/createtaks';
import GroupEntryPage from '../pages/groups/groupentry';
import AuthRoute from './auth'; // Import the AuthRoute component
import GroupSearchPage from '../pages/groups/joingroups';
import TaskSummaryReport from '../pages/reports/reportfilter';
const GroupRoutes: React.FC = () => {
    const location = useLocation(); // Get the current route

    // Condition to check if the current route is '/groups'
    const showSideNavbar = location.pathname !== '/group/groups';

    return (
        <div className="flex">
            <Navbar />
            {/* Conditionally render SideNavbar based on the route */}
            {showSideNavbar && <SideNavbar />}

            {/* Route content will change based on the URL */}
            <div className={showSideNavbar ? 'flex-grow' : 'flex-grow w-full'}>
                <Routes>
                    <Route path="/groups" element={<AuthRoute element={<GroupsPage />} />} />
                    <Route path="/:groupId/page" element={<AuthRoute element={<GroupPage />} />} />
                    <Route path="/:groupId/create_task" element={<AuthRoute element={<CreateTaskPage />} />} />
                    <Route path="/:groupId/members" element={<AuthRoute element={<MembersPage />} />} />
                    <Route path="/:groupId/entry" element={<AuthRoute element={<GroupEntryPage />} />} />
                    <Route path="/joingroups" element={<AuthRoute element={<GroupSearchPage />} />} />
                    <Route path="/:groupId/report" element={<AuthRoute element={<TaskSummaryReport />} />} />
                </Routes>
            </div>
        </div>
    );
};

export default GroupRoutes;
