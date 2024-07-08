import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer , persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from '../slices/authSlice'
import profileReducer from '../slices/profileSlice'
import cartReducer from '../slices/cartSlice'
import courseReducer from '../slices/courseSlice'
import viewCourseReducer from "../slices/viewCourseSlice";
const persistConfig = {
    key: 'root',
    storage,
    version:1
}


const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  course: courseReducer,
  cart: cartReducer,
  viewCourse: viewCourseReducer,
})



const persistedReducer = persistReducer(persistConfig , rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
      serializableCheck: false
    })
  })

export const persistor = persistStore(store)