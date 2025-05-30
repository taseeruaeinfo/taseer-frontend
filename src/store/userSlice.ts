import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
interface UserState {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  type: "creator" | "brand";
  profilePic: string;
  phone: string;
  nationality: string;
  countryCode: string;
  city: string;
  dob: string;
}

const token = Cookies.get("jwt")

const initialState: UserState | any = !token ? null :null;


const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginSuccess: (_state, action: PayloadAction<UserState>) => {
      return action.payload;
    },
    logout: () => {
      return null;
    },
  },
});

export const { loginSuccess, logout } = userSlice.actions;
export default userSlice.reducer;
