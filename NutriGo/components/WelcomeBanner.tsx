import React from 'react';
import { useUser } from '../hooks/useUser'; // Ensure this path correctly points to where useUser is re-exported or defined

const WelcomeBanner = () => {
  const { user, setUser } = useUser();

  return (
    <div>
      {user ? <p>Welcome, {user.name}</p> : <p>No user logged in</p>}
    </div>
  );
};

export default WelcomeBanner;