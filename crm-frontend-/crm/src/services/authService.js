// import api from "./api";

/*export const loginUser = (data) => {
  return api.post("/auth/login", data);
};

export const registerUser = (data) => {
  return api.post("/auth/register", data);
};

export const getProfile = () => {
  return api.get("/auth/profile");
};


export const forgotPassword = (email) => {
  return api.post("/auth/forgot-password", { email });
};

export const resetPassword = (data) => {
  return api.post("/auth/reset-password", data);
};*/

// 🔹 In-memory mock database
let mockUsers = [
  {
    id: 1,
    firstName: "Admin",
    lastName: "Admin",
    email: "admin@gmail.com",
    role: "admin",
    phone: "",
    password: "Admin@123",
    confirmPassword: "Admin@123",
    companyName: "",
    industryType: "",
    country: "",
    resetToken: null,
    resetTokenExpiry: null,
  },
];

// 📝 REGISTER
export const registerUser = async (formData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Check duplicate email
      const existingUser = mockUsers.find(
        (u) => u.email.toLowerCase() === formData.email.toLowerCase(),
      );

      if (existingUser) {
        reject({
          response: { data: { message: "Email already registered" } },
        });
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        reject({
          response: { data: { message: "Passwords do not match" } },
        });
        return;
      }

      const newId =
        mockUsers.length > 0 ? Math.max(...mockUsers.map((u) => u.id)) + 1 : 1;

      const { confirmPassword, ...userToStore } = formData;

      const newUser = { id: newId, ...userToStore };
      mockUsers.push(newUser);

      resolve({
        data: {
          id: newUser.id,
          name: newUser.firstName + " " + newUser.lastName,
          email: newUser.email,
        },
      });
    }, 800);
  });
};

// 📧 FORGOT PASSWORD - generates a simple mock token and link
export const forgotPassword = (email) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = mockUsers.find(
        (u) => u.email.toLowerCase() === email.toLowerCase(),
      );

      if (!user) {
        reject({ response: { data: { message: "Email not found" } } });
        return;
      }

      // simple mock token
      const token = `mock-reset-token-${user.id}-${Date.now()}`;
      const expiry = Date.now() + 15 * 60 * 1000; // 15 mins

      user.resetToken = token;
      user.resetTokenExpiry = expiry;

      const resetLink = `/reset-password?email=${encodeURIComponent(email)}&token=${token}`;
      console.log(`Mock reset link for ${email}: ${resetLink}`);

      resolve({
        data: {
          message: "A password reset link has been sent to your email",
          link: resetLink,
        },
      });
    }, 800);
  });
};

// 🔄 RESET PASSWORD - verifies token before updating
export const resetPassword = ({ email, token, newPassword }) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = mockUsers.find(
        (u) => u.email.toLowerCase() === email.toLowerCase(),
      );

      if (!user) {
        reject({ response: { data: { message: "Email not found" } } });
        return;
      }

      if (user.resetToken !== token) {
        reject({ response: { data: { message: "Invalid or expired token" } } });
        return;
      }

      if (Date.now() > user.resetTokenExpiry) {
        user.resetToken = null;
        user.resetTokenExpiry = null;
        reject({ response: { data: { message: "Token has expired" } } });
        return;
      }

      // update password & clear token
      user.password = newPassword;
      user.resetToken = null;
      user.resetTokenExpiry = null;

      resolve({ data: { message: "Password updated successfully" } });
    }, 800);
  });
};

// 🔐 LOGIN
// 🔐 LOGIN
// 🔐 LOGIN (mock + decoding here)
export const loginUser = async (formData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const foundUser = mockUsers.find(
        (u) => u.email === formData.email && u.password === formData.password,
      );

      if (!foundUser) {
        reject({
          response: { data: { message: "Invalid email or password" } },
        });
        return;
      }

      // 🔹 Mock token (base64 JSON)
      const payload = {
        id: foundUser.id,
        role: foundUser.role,
        email: foundUser.email,
      };
      const token = btoa(JSON.stringify(payload));
      console.log("token", token);
      // 🔹 Decode token immediately (works for mock or real JWT)
      let role = null;
      try {
        // For mock token:
        const decodedMock = JSON.parse(atob(token));
        role = decodedMock.role;

        // For real API JWT, use:
        // const decodedReal = jwt_decode(token);
        // role = decodedReal.role;
      } catch (err) {
        console.error("Token decode failed", err);
      }

      resolve({
        data: {
          user: {
            id: foundUser.id,
            name: foundUser.firstName + " " + foundUser.lastName,
            email: foundUser.email,
          },
          token,
          role, // send role directly
        },
      });
    }, 800);
  });
};






// import api from "./api";

// export const loginUser = (data) => {
//   return api.post("/auth/login/", data);
// };

// export const registerUser = (data) => {
//   return api.post("/auth/register/", data);
// };