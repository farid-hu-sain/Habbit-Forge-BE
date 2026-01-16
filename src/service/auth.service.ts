import { UserService } from "./user.service.js";

const userService = new UserService();

export const register = userService.register.bind(userService);
export const login = userService.login.bind(userService);
export const getCurrentUser = userService.getCurrentUser.bind(userService);