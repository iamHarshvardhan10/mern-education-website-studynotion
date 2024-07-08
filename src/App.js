import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Navbar from './components/common/Navbar.jsx'
import './App.css'
import OpenRoute from './components/cors/Auth/OpenRoute.jsx'
import Signup from './pages/Signup.jsx'
import Login from './pages/Login.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import UpdatePassword from './pages/UpdatePassword.jsx'
import VerifyEmail from './pages/VerifyEmail.jsx'
import { About } from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import MyProfile from './components/cors/Dashboard/MyProfile.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Settings from './components/cors/Dashboard/Settings/index.jsx'
import Error from './pages/Error.jsx'
import EnrolledCourses from './components/cors/Dashboard/EnrolledCourses.jsx'
import Cart from './components/cors/Dashboard/Cart/index.jsx'
import { ACCOUNT_TYPE } from './utils/constants.js'
import { useSelector } from 'react-redux'
import MyCourses from './components/cors/Dashboard/MyCourses.jsx'
import AddCourse from './components/cors/Dashboard/AddCourse/index.jsx'
import EditCourse from './components/cors/Dashboard/EditCourse/index.jsx'
import Instructor from './components/cors/Dashboard/Instructor.jsx'
import Catalog from './pages/Catalog.jsx'
import CourseDetails from './pages/CourseDetails.jsx'
import ViewCourse from './pages/ViewCourse.jsx'
import VideoDetails from './components/cors/ViewCourse/VideoDetails.jsx'
import PrivateRoute from './components/cors/Auth/PrivateRoute.jsx'

const App = () => {
  const { user } = useSelector((state) => state.profile)
  return (
    <div className='w-screen min-h-screen bg-richblack-900 flex flex-col font-inter'>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route
          path='/about'
          element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path='catalog/:catalogName' element={<Catalog />} />

        <Route path="courses/:courseId" element={<CourseDetails />} />

        {/* open route for only non logged user */}
        <Route
          path="signup"
          element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          }
        />
        <Route
          path="login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />
        <Route
          path="forgot-password"
          element={
            <OpenRoute>
              <ForgotPassword />
            </OpenRoute>
          }
        />
        <Route
          path="update-password/:id"
          element={
            <OpenRoute>
              <UpdatePassword />
            </OpenRoute>
          }
        />
        <Route
          path='verify-email'
          element={
            <OpenRoute>
              <VerifyEmail />
            </OpenRoute>
          }

        />

        <Route element={<PrivateRoute><Dashboard /></PrivateRoute>}>
          <Route path='dashboard/my-profile' element={<MyProfile />}></Route>
          <Route path='dashboard/settings' element={<Settings />} />
          {/* Route only for Instructors */}
          {user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
            <>
              <Route path="dashboard/instructor" element={<Instructor />} />
              <Route path="dashboard/my-courses" element={<MyCourses />} />
              <Route path="dashboard/add-course" element={<AddCourse />} />
              <Route
                path="dashboard/edit-course/:courseId"
                element={<EditCourse />}
              />
            </>
          )}
          {/* Route only for Students */}
          {user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
              <Route
                path="dashboard/enrolled-courses"
                element={<EnrolledCourses />}
              />
              <Route path="/dashboard/cart" element={<Cart />} />
            </>
          )}
        </Route>

        {/* For the watching course lectures */}
        <Route
          element={
            <PrivateRoute>
              <ViewCourse />
            </PrivateRoute>
          }
        >
          {user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
              <Route
                path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
                element={<VideoDetails />}
              />
            </>
          )}
        </Route>



        {/* 404 Page */}
        <Route path="*" element={<Error />} />
      </Routes>
    </div>
  )
}

export default App;