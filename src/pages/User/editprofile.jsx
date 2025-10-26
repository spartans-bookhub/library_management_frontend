import React, { useState, useEffect } from "react";
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
import { authService } from "../../services/authService";
import { userService } from "../../services/userService";

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
  const [profileSaveMessage, setProfileSaveMessage] = useState(null);
  const [passwordChangeMessage, setPasswordChangeMessage] = useState(null);
  const [loadingProfileSave, setLoadingProfileSave] = useState(false);
  const [loadingPasswordChange, setLoadingPasswordChange] = useState(false);

  useEffect(() => {
    setFormData({
      userId: user.userId || "",
      userName: user.userName || "",
      contactNumber: user.contactNumber || "",
      address: user.address || "",
      email: user.email || "",
    });
  }, [user]);


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
    setProfileSaveMessage(null);
    try {
    const token = getToken();
    const data = await userService.updateProfile(formData) 
    updateUser(data);
    showSuccess("Profile updated successfully!")
    setProfileSaveMessage("Profile updated successfully!");
    } catch (error) {
        console.log(error)
        setProfileSaveMessage(error.message || "Failed to update profile");
        showError("Failed to update profile : "+error.message)
      } finally {
      setLoadingProfileSave(false);
      }

  };

  const handleChangePassword = async () => {
    if (!validatePasswordForm()) return;

    setLoadingPasswordChange(true);
    setPasswordChangeMessage(null);

    try {
      const response = await userService.changePassword(passwordForm)
      setPasswordChangeMessage("Password changed successfully!");
      showSuccess("Password changed successfully!");
      setPasswordForm({ oldPassword: "", newPassword: "", confirmNewPassword: "" });
      setShowPasswordForm(false);
    } catch (err) {
        console.log(err)
        setPasswordChangeMessage("Failed to change password. "+err.response.data);
  
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

        {profileSaveMessage && (
          <Alert severity={profileSaveMessage.includes("successfully") ? "success" : "error"} sx={{ mb: 2 }}>
            {profileSaveMessage}
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
              setPasswordChangeMessage(null);
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
              {passwordChangeMessage && (
                <Alert
                  severity={passwordChangeMessage.includes("successfully") ? "success" : "error"}
                  sx={{ mb: 2 }}
                >
                  {passwordChangeMessage}
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
