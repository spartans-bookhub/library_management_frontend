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
import { useAuth } from "../../context/AuthContext";
import { API_BASE_URL, API_ENDPOINTS } from "../../constants/apiEndpoints";
import { useToast } from "../../context/ToastContext";

const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).*$/;

export default function EditProfile({onCancel}) {
    const location = useLocation()
    const {user, getToken, updateUser} = useAuth();
    const { showSuccess, showError, showWarning, showInfo } = useToast();
    const [formData, setFormData] = useState({
    userId: user.userId || "",
    userName: user?.userName || "",
    contactNumber: user?.contactNumber || "",
    address: user?.address || "",
    email: user?.email || "",
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
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
    //Validation
    if (!formData.userName.trim()) tempErrors.userName = "User Name is required";
    if (!formData.contactNumber.trim()) tempErrors.contactNumber = "Contact Number is required";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const validatePasswordForm = () => {
    let tempErrors = {};
    if (!passwordForm.oldPassword) tempErrors.oldPassword = "Current password required";
    if (!passwordForm.newPassword) {
      tempErrors.newPassword = "New password required";
    } else if (passwordForm.newPassword.length < 6) {
      tempErrors.newPassword = "New password must be at least 6 characters";
    } else if (!passwordRegex.test(passwordForm.newPassword)) {
      tempErrors.newPassword =
        "Password must contain at least one digit, one uppercase letter, one lowercase letter, and one special character";
    }
if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
        tempErrors.confirmNewPassword = "New password and confirm password do not match";
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
    if (!validateProfile()) return;

    setLoadingProfileSave(true);
    setProfileSaveSuccess(null);

    try {
    const token = getToken();
    const response = await axios.put(
        `${API_BASE_URL}${API_ENDPOINTS.USER.UPDATE_PROFILE}${formData.userId}`,
        formData,
        {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        }
    );

    const data = response.data;
    setFormData(data);
    updateUser(data);
    showSuccess("Profile updated successfully!")
    setProfileSaveSuccess("Profile updated successfully!");
    } catch (err) {
    console.log(err)
    if (err.response?.data?.message) {
        console.log(err.response.data.message)
        setProfileSaveSuccess(err.response.data.message);
    } else {
        setProfileSaveSuccess("An unknown error occurred.");
    }
    } finally {
    setLoadingProfileSave(false);
    }

  };

  const handleChangePassword = async () => {
    if (!validatePasswordForm()) return;

    setLoadingPasswordChange(true);
    setPasswordChangeSuccess(null);

    try {
       const token = getToken();
     const response = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.USER.CHANGE_PASSWORD}`, passwordForm,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
     );

      setPasswordChangeSuccess("Password changed successfully!");
      setPasswordForm({ oldPassword: "", newPassword: "", confirmNewPassword: "" });
      setShowPasswordForm(false);
    } catch (err) {
        console.log(err)
        setPasswordChangeSuccess("Failed to change password. "+err.response.data);
        //  if (err.response?.data) {
        //     console.log(err.response.data)
        //     setPasswordChangeSuccess(err.response.data);
        // }else{
        //     setPasswordChangeSuccess("Failed to change password.");
        // }
    } finally {
      setLoadingPasswordChange(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={5} sx={{ p: 4 }}>
        <Typography variant="h6" gutterBottom>
          Edit Profile
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
            variant="contained"
            onClick={onCancel}
           
          >
            Cancel Edit
          </Button>

          <Button
            variant="outlined"
            onClick={() => {
              setShowPasswordForm((prev) => !prev);
              setPasswordChangeSuccess(null);
              setPasswordErrors({});
              setPasswordForm({
                    oldPassword: "",
                    newPassword: "",
                    confirmNewPassword: ""
                    });
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
                name="oldPassword"
                value={passwordForm.oldPassword}
                onChange={handlePasswordChangeInput}
                error={Boolean(passwordErrors.oldPassword)}
                helperText={passwordErrors.oldPassword}
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
               <TextField
                label="Confirm New Password"
                type="password"
                name="confirmNewPassword"
                value={passwordForm.confirmNewPassword}
                onChange={handlePasswordChangeInput}
                error={Boolean(passwordErrors.confirmNewPassword)}
                helperText={
                  passwordErrors.confirmNewPassword ||
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
