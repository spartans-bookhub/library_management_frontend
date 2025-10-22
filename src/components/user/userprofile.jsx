import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Stack,
  Alert,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import axios from "axios";

const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).*$/;

export default function UserProfile() {
    const location = useLocation()
    const user = location.state?.user
    const [formData, setFormData] = useState({
    userId: user?.userId || "",
    userName: user?.userName || "",
    contactNumber: user?.contactNumber || "",
    address: user?.address || "",
    email: user?.email || "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(null);
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(null);
  const [loadingProfileSave, setLoadingProfileSave] = useState(false);
  const [loadingPasswordChange, setLoadingPasswordChange] = useState(false);

  const validateProfile = () => {
    let tempErrors = {};
    if (!formData.userName.trim()) tempErrors.userName = "User Name is required";
    if (!formData.contactNumber.trim()) tempErrors.contactNumber = "Contact Number is required";
    if (!formData.address.trim()) tempErrors.address = "Address is required";
    // Can add more validation if needed
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const validatePasswordForm = () => {
    let tempErrors = {};
    if (!passwordForm.currentPassword) tempErrors.currentPassword = "Current password required";
    if (!passwordForm.newPassword) {
      tempErrors.newPassword = "New password required";
    } else if (passwordForm.newPassword.length < 6) {
      tempErrors.newPassword = "New password must be at least 6 characters";
    } else if (!passwordRegex.test(passwordForm.newPassword)) {
      tempErrors.newPassword =
        "Password must contain at least one digit, one uppercase letter, one lowercase letter, and one special character";
    }
    setPasswordErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: null,
    }));
  };

  const handlePasswordChangeInput = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setPasswordErrors((prev) => ({
      ...prev,
      [name]: null,
    }));
  };

  const handleSaveProfile = async () => {
    alert("handleSaveProfile")
    if (!validateProfile()) return;

    setLoadingProfileSave(true);
    setProfileSaveSuccess(null);

    try {
        alert("formData.userId="+formData.userId)
       const  yourJwtToken = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqb2huQHRlc3QuY29tI…TAzfQ.H3M6pOJPMCD1-nEdhY0SYHRIxjKLMhBfLq33b7a0VUM"
      axios.get(`http://localhost:9007/api/v1/user/${formData.userId}`,
        {
            headers: {
                Authorization: `Bearer ${yourJwtToken}`
            }
            }
      )
        .then((res)=>{
            const data = res.data
            setFormData(data)
            // setFormData((prev)=>({
            //     ...prev,
            //     [field]: value

            // }))
             setProfileSaveSuccess("Profile updated successfully!");
        })
        .catch((err)=>{
             setProfileSaveSuccess("Failed to update profile.");
        })
        .finally(()=>{
            setLoadingProfileSave(false);
        })
        } catch (err) {
  console.error("Outer try-catch error:", err);
}

    //   setProfileSaveSuccess("Profile updated successfully!");
    // } catch (error) {
    //   setProfileSaveSuccess("Failed to update profile.");
    // } finally {
    //   setLoadingProfileSave(false);
    // }
  };

  const handleChangePassword = async () => {
    if (!validatePasswordForm()) return;

    setLoadingPasswordChange(true);
    setPasswordChangeSuccess(null);

    try {
      // Replace with actual API call
      await fakeApiChangePassword(passwordForm.currentPassword, passwordForm.newPassword);

      setPasswordChangeSuccess("Password changed successfully!");
      setPasswordForm({ currentPassword: "", newPassword: "" });
      setShowPasswordForm(false);
    } catch (error) {
      setPasswordChangeSuccess("Failed to change password.");
    } finally {
      setLoadingPasswordChange(false);
    }
  };

  // Fake API calls to simulate backend
  const fakeApiUpdateProfile = (data) =>
    new Promise((resolve) => setTimeout(() => resolve(data), 1000));

  const fakeApiChangePassword = (currentPwd, newPwd) =>
    new Promise((resolve, reject) =>
      setTimeout(() => {
        if (currentPwd === "correct-password") resolve();
        else reject(new Error("Incorrect current password"));
      }, 1000)
    );

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={5} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          User Profile
        </Typography>

        {profileSaveSuccess && (
          <Alert severity={profileSaveSuccess.includes("successfully") ? "success" : "error"} sx={{ mb: 2 }}>
            {profileSaveSuccess}
          </Alert>
        )}

        <Stack spacing={3}>
          <TextField
            label="User Name"
            name="userName"
            value={formData.userName}
            onChange={handleInputChange}
            error={Boolean(errors.userName)}
            helperText={errors.userName}
            fullWidth
          />

          <TextField
            label="Contact Number"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleInputChange}
            error={Boolean(errors.contactNumber)}
            helperText={errors.contactNumber}
            fullWidth
          />

          <TextField
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            error={Boolean(errors.address)}
            helperText={errors.address}
            fullWidth
            multiline
            minRows={2}
          />

          <TextField
            label="Email"
            name="email"
            value={formData.email}
            disabled
            fullWidth
          />

          <Button
            variant="contained"
            onClick={handleSaveProfile}
            disabled={loadingProfileSave}
          >
            {loadingProfileSave ? "Saving..." : "Save Profile"}
          </Button>

          <Button
            variant="outlined"
            onClick={() => {
              setShowPasswordForm((prev) => !prev);
              setPasswordChangeSuccess(null);
              setPasswordErrors({});
              setPasswordForm({ currentPassword: "", newPassword: "" });
            }}
          >
            {showPasswordForm ? "Cancel Password Change" : "Change Password"}
          </Button>

          {showPasswordForm && (
            <Box sx={{ mt: 2 }}>
              {passwordChangeSuccess && (
                <Alert
                  severity={passwordChangeSuccess.includes("successfully") ? "success" : "error"}
                  sx={{ mb: 2 }}
                >
                  {passwordChangeSuccess}
                </Alert>
              )}

              <TextField
                label="Current Password"
                type="password"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChangeInput}
                error={Boolean(passwordErrors.currentPassword)}
                helperText={passwordErrors.currentPassword}
                fullWidth
                sx={{ mb: 2 }}
              />

              <TextField
                label="New Password"
                type="password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChangeInput}
                error={Boolean(passwordErrors.newPassword)}
                helperText={
                  passwordErrors.newPassword ||
                  "At least 6 chars, with digit, uppercase, lowercase & special char"
                }
                fullWidth
                sx={{ mb: 2 }}
              />

              <Button
                variant="contained"
                onClick={handleChangePassword}
                disabled={loadingPasswordChange}
              >
                {loadingPasswordChange ? "Changing..." : "Change Password"}
              </Button>
            </Box>
          )}
        </Stack>
      </Paper>
    </Container>
  );
}
