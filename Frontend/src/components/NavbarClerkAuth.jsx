import React from 'react';
import { SignedIn, SignedOut, useClerk, UserButton } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

const OrdersIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
    <path d="M3 6h18" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const ClerkUserMenu = () => {
  const navigate = useNavigate();

  return (
    <UserButton afterSignOutUrl="/">
      <UserButton.MenuItems>
        <UserButton.Action
          label="My Orders"
          labelIcon={<OrdersIcon />}
          onClick={() => navigate('/my-orders')}
        />
      </UserButton.MenuItems>
    </UserButton>
  );
};

const NavbarClerkAuth = ({ loginButtonClass, onMobileLogin, autoSignIn, onAutoSignInDone }) => {
  const { openSignIn } = useClerk();

  React.useEffect(() => {
    if (!autoSignIn) return;
    openSignIn();
    onAutoSignInDone?.();
  }, [autoSignIn, openSignIn, onAutoSignInDone]);

  return (
    <>
      <SignedIn>
        <ClerkUserMenu />
      </SignedIn>
      <SignedOut>
        <button
          type="button"
          onClick={() => {
            openSignIn();
            onMobileLogin?.();
          }}
          className={loginButtonClass}
        >
          Login
        </button>
      </SignedOut>
    </>
  );
};

export default NavbarClerkAuth;
