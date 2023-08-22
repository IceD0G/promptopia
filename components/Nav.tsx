'use client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import logo from '@public/images/logo.svg';
import Image from 'next/image';
import { signOut, signIn, useSession, getProviders, LiteralUnion, ClientSafeProvider } from 'next-auth/react';
import { BuiltInProviderType } from 'next-auth/providers/index';

const Nav = () => {
  const { data: session } = useSession();
  const [providers, setProviders] = useState<Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  > | null>(null);
  const [toggleDropdown, setToggleDropdown] = useState(false);
  const toggleDropdownHandle = () => {
    setToggleDropdown(value => !value);
  };

  useEffect(() => {
    const setProvidersFn = async () => {
      const response = await getProviders();
      setProviders(response);
    };
    setProvidersFn();
  }, []);

  return (
    <nav className={'flex-between w-full mb-16 pt-3'}>
      <Link href={'/'} className={'flex gap-2 flex-center'}>
        <Image src={logo} alt={'promptopia-logo'} width={30} height={30} className={'object-contain'} />
        <p className={'logo_text'}>Promptopia</p>
      </Link>
      <div className={'sm:flex hidden'}>
        {session?.user ? (
          <div className={'flex gap-3 md:gap-5'}>
            <Link href={'/create-prompt'} className={'black_btn'}>
              Create Post
            </Link>
            <button type="button" onClick={() => signOut()} className={'outline_btn'}>
              Sign Out
            </button>
            <Link href={'/profile'}>
              <Image src={session?.user.image} alt={'Profile'} width={37} height={37} className={'rounded-full'} />
            </Link>
          </div>
        ) : (
          <>
            {providers &&
              Object.values(providers).map(provider => (
                <button type="button" key={provider.name} onClick={() => signIn(provider.id)} className="black_btn">
                  Sign in
                </button>
              ))}
          </>
        )}
      </div>
      {/* Mobile Navigation */}
      <div className="sm:hidden flex relative">
        {session?.user ? (
          <div className="flex">
            <Image
              src={session?.user.image}
              alt={'Profile'}
              width={37}
              height={37}
              className={'rounded-full'}
              onClick={toggleDropdownHandle}
            />
            {toggleDropdown && (
              <div className="dropdown">
                <Link href={'/profile'} className="dropdown_link" onClick={toggleDropdownHandle}>
                  My Profile
                </Link>
                <Link href={'/create-prompt'} className="dropdown_link" onClick={toggleDropdownHandle}>
                  Create Prompt
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    toggleDropdownHandle();
                    signOut();
                  }}
                  className="mt-5 w-full black_btn"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            {providers &&
              Object.values(providers).map(provider => (
                <button type="button" key={provider.name} onClick={() => signIn(provider.id)} className="black_btn">
                  Sign in
                </button>
              ))}
          </>
        )}
      </div>
    </nav>
  );
};

export default Nav;
