
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

function ResetPasswordPage() {
  const location = useLocation();
  const [token, setToken] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenFromUrl = params.get('token');
    alert("tokenFromUrl="+tokenFromUrl);
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      // Optionally validate token by calling backend here
    } else {
      // Handle missing token (e.g., redirect or show error)
    }
  }, [location]);

  return (
    <div>
      {token ? (
        <div>
          <h2>Reset Your Password</h2>
          <p>Token: {token}</p>
          {/* render reset form and use token in form submit */}

          {/* add text box for pass and confirm pass and send to api */}
        </div>
      ) : (
        <p>Invalid or missing reset token</p>
      )}
    </div>
  );
}

export default ResetPasswordPage;