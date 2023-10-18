import React, { useState, useEffect, ChangeEvent } from 'react';
import Button from '@ui/Button';
import { ArrowLeft2, Import, CloseCircle } from 'iconsax-react';
import MainLayout from '../components/Layout/MainLayout';
import InviteLink from '../modules/portfolio/component/portfolioSettingsComponents/inviteLink';
import NotificationSettings from '../modules/portfolio/component/portfolioSettingsComponents/notificationsSettings';
import { SettingOptionTypes } from '../@types';
import DeleteAccount from '@modules/portfolio/component/portfolioSettingsComponents/DeleteAccount';
import AccountManagement from '@modules/portfolio/component/portfolioSettingsComponents/AccountManagement';
import AccountManagementMobile from '@modules/portfolio/component/portfolioSettingsComponents/AcctMgtMobile';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { NotificationCheckboxType } from '../@types';
import { useRouter } from 'next/router';
import withAuth from '../helpers/withAuth';
import Image from 'next/image';
import { useAuth } from '../context/AuthContext';
import Twofa from '@modules/portfolio/component/portfolioSettingsComponents/2fa';
import defaultpic from '../public/assets/inviteAssets/profile.svg';
import { notify } from '@ui/Toast';
import axios from 'axios';
import Success from './auth/success';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import nProgress from 'nprogress';

const SettingPage = () => {
  const [settingOption, setSettingOption] = useState<SettingOptionTypes>({
    accountManagement: false,
    notificationSettings: false,
    deleteAccount: false,
    refer: false,
  });

  const { auth } = useAuth();
  const router = useRouter();

  const openEachSeting = Object.values(settingOption).some((value) => value === true);

  const [loading, setLoading] = useState<boolean>(false);
  const [local, setlocal] = useState<boolean>(false);
  const [closeAcc, setCloseAcc] = useState<boolean>(true);

  const [showReferInfo, setShowReferInfo] = useState<boolean>(false);
  const [userPic, setUserPic] = useState<string>('');

  const changeSettingOptions = (optionsSettings: keyof SettingOptionTypes) => {
    setSettingOption((prevSettingOption) => {
      const updatedSettingOption: any = { ...prevSettingOption };
      updatedSettingOption[optionsSettings] = true;

      for (const key in updatedSettingOption) {
        if (key !== optionsSettings) {
          updatedSettingOption[key] = false;
        }
      }

      return updatedSettingOption;
    });
  };

  const resetSettingOption = () => {
    const newSettingOption: SettingOptionTypes = {
      accountManagement: false,
      notificationSettings: false,
      deleteAccount: false,
      refer: false,
    };
    setSettingOption(newSettingOption);
    setCloseAcc(true);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1024) {
        setSettingOption((prevSettingOption) => ({
          ...prevSettingOption,
          accountManagement: true,
        }));
      }
    }
  }, []);

  const [checkboxState, setCheckboxState] = useState<NotificationCheckboxType>({
    emailSummary: false,
    specialOffers: false,
    communityUpdate: false,
    followUpdate: false,
    newMessages: false,
  });
  const baseUrl = 'https://hng6-r5y3.onrender.com/api/';
  const handleNotificationUpdate = async () => {
    setLoading(true);
    try {
      const storedNotificationData = localStorage.getItem(`notificationData${auth?.user.id}`);
      const method = storedNotificationData ? 'PATCH' : 'POST';

      const url = `${baseUrl}set-notification-settings/${auth?.user.id}`;
      const response = await fetch(url, {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkboxState),
      });

      if (response.ok) {
        console.log('Request type:', method);
        const data = await response.json();
        console.log('Notification settings updated successfully:', data.data);
        const { userId, ...notificationData } = data.data;

        setCheckboxState(notificationData);

        localStorage.setItem(`notificationData${auth?.user.id}`, JSON.stringify(notificationData));

        toast.success('Updated Successfully', {
          position: 'top-center',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });

        setTimeout(() => {
          router.push('/');
        }, 3100);
      } else {
        console.error('Failed to update notification settings');
        toast.error('Unable To Update!', {
          position: 'top-center',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });

        setCheckboxState({
          emailSummary: false,
          specialOffers: false,
          communityUpdate: false,
          followUpdate: false,
          newMessages: false,
        });
      }
    } catch (error) {
      console.error('An error occurred while updating notification settings:', error);
    } finally {
      setLoading(false);
      setlocal((prv) => !prv);
    }
  };

  const handleGetUser = async () => {
    try {
      const url = `${baseUrl}users/${auth?.user.id}`;
      const response = await fetch(url);

      if (response.ok) {
        const data = await response.json();
        console.log('user', data);
        setUserPic(data?.user?.profilePic);
      } else {
      }
    } catch (error) {
      console.error('An error occurred while updating notification settings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetUser();
  }, [settingOption]);
  const getNotificationSettingsFromLocalStorage = () => {
    const storedNotificationData = localStorage.getItem(`notificationData${auth?.user.id}`);
    if (storedNotificationData) {
      const parsedData = JSON.parse(storedNotificationData);
      setCheckboxState(parsedData);
    }
  };

  useEffect(() => {
    getNotificationSettingsFromLocalStorage();
  }, [local]);

  const toggleShow = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    setter((prev: boolean) => !prev);
  };

  // const hhh = async () => {
  //   if (selectedFile) {
  //     const formData = new FormData();
  //     formData.append('profilepics', selectedFile);
  //     formData.append('profilepics', auth?.user.id || '');

  //     const url = 'https://hng6-r5y3.onrender.com/api/profile/image/upload';

  //     try {
  //       // Use toast.promise to display upload progress and results
  //       toast.promise(axios.post(url, formData), {
  //         pending: 'Uploading...',
  //         success: 'Upload successful',
  //         error: 'Failed to upload',
  //       });
  //     } catch (error) {
  //       console.error('An error occurred:', error);
  //     }
  //   } else {
  //     console.error('Please select a file to upload');
  //   }
  // };

  const [selectedPics, setSelectedPics] = useState<string | StaticImport>('');

  // const handleFileChang = (event: ChangeEvent<HTMLInputElement>) => {
  //   const files = event.target.files;

  //   if (files) {
  //     const file = files[0];
  //     setSelectedPics(URL?.createObjectURL(file));
  //     setSelectedFile(file);
  //   } else {
  //     setSelectedPics('');
  //     setSelectedFile(undefined);
  //   }
  // };

  const handlePic = async (coverImage: string | Blob) => {
    try {
      const formData = new FormData();
      formData.append('images', coverImage as string | Blob);
      formData.append('userId', auth?.user?.id as string);

      const promise = axios.post('https://hng6-r5y3.onrender.com/api/profile/image/upload', formData);

      const successMessage = 'Image uploaded successfully';
      const response = await toast.promise(promise, {
        pending: 'Uploading image...',
        success: successMessage,
        error: 'An error occurred while uploading the image',
      });

      setTimeout(() => {
        toast.dismiss();
      }, 5000);

      console.log('uploaded', response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const image = URL.createObjectURL(file);
      if (e.target.id === 'avatarUpload') {
        setSelectedPics(image);
      }
      await handlePic(file);
    }
  };

  return (
    <MainLayout activePage="setting" showFooter={true} showDashboardSidebar={false} showTopbar className="relative">
      <div className="w-full   relative font-manropeEB mb-4  lg:mb-2   flex flex-col  ">
        {/*  Laptop View*/}
        <div
          className="md:hidden hidden lg:flex lg:border-b-[1px]  cursor-auto
            lg:border-white-500 relative min-h-[90vh]   items-start before:bg-white-500 
            before:w-full before:absolute before:top-[5.3rem] before:h-[0.5px]
                     pb-0   py-[3rem]  "
        >
          <div className="font-manropeB  relative cursor-pointer  min-w-[408px]  text-[#737876]   font-normal">
            <ul
              className="flex gap-5
             text-sm font-manropeB font-semibold  justify-center w-full relative "
            >
              <li
                onClick={() => setShowReferInfo(false)}
                className={`hover:text-brand-green-hover ${
                  !showReferInfo ? 'border-b-2 pb-[8px] text-brand-green-primary border-brand-green-primary' : ''
                }`}
              >
                Settings
              </li>
              <li
                onClick={() => setShowReferInfo(true)}
                className={`hover:text-brand-green-hover   ${
                  showReferInfo ? 'border-b-2 text-brand-green-primary pb-[8px] border-brand-green-primary' : ''
                }`}
              >
                Invite a friend
              </li>
            </ul>

            <div className="flex  font-manropeB text-dark-110 mt-[24px]  relative w-full  gap-10">
              <div className="w-full text-center">
                <ul
                  className={`text-semibold    font-manropeB text-sm text-dark-110 
                   bg-brand-green-shade95 ${!showReferInfo && 'hidden'}`}
                >
                  <li
                    className={`py-3 flex justify-center  hover:bg-brand-green-shade95  
                  ${showReferInfo && 'w-full bg-[#E6F5EA]'}`}
                  >
                    <p className="min-w-[170px] text-start">Refer your friends</p>
                  </li>
                </ul>
                <ul
                  className={`   flex-col gap-1  font-manropeB ${
                    showReferInfo ? 'hidden' : 'flex'
                  } font-semilbold text-sm`}
                >
                  <li
                    onClick={() => {
                      changeSettingOptions('accountManagement');
                    }}
                    className={`flex justify-center    py-3 hover:bg-brand-green-shade95 w-full ${
                      settingOption.accountManagement && 'w-full bg-[#E6F5EA]'
                    }`}
                  >
                    <button className="min-w-[170px] text-start">Account Management</button>
                  </li>
                  <li
                    className={` flex justify-center py-3 hover:bg-brand-green-shade95 w-full ${
                      settingOption.notificationSettings && ' bg-[#E6F5EA]'
                    }`}
                    onClick={() => {
                      changeSettingOptions('notificationSettings');
                    }}
                  >
                    <button className="min-w-[170px] text-start">Notification Settings</button>
                  </li>
                  <li
                    className={`flex justify-center    py-3 hover:bg-brand-green-shade95 w-full ${
                      settingOption.deleteAccount && 'w-full bg-[#E6F5EA]'
                    }`}
                    onClick={() => {
                      setShowReferInfo(false);
                      changeSettingOptions('deleteAccount');
                    }}
                  >
                    <button className="min-w-[170px] text-start">Delete Account</button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div
            className="grow min-h-[100vh] relative lg:border-l-[1px] lg:border-white-500 
            lg:px-[52px]  "
          >
            <ul className="flex gap-6   cursor-pointer  font-manropeL justify-between w-full  relative">
              <li className={`text-md text-dark-110 `}> {showReferInfo ? 'Invite your friend' : 'Settings'}</li>
            </ul>
            <div className="mt-[42px] ">
              {showReferInfo ? (
                <InviteLink />
              ) : (
                <div className="mt-[26px]">
                  {settingOption.notificationSettings && (
                    <NotificationSettings checkboxState={checkboxState} setCheckboxState={setCheckboxState} />
                  )}
                  {settingOption.deleteAccount && <DeleteAccount />}
                  {settingOption.accountManagement && (
                    <div>
                      <h3 className=" font-manropeEB text-[1rem] sm:text-[1.375rem] text-[#2E3130] leading-[1.75rem]">
                        Account Management
                      </h3>
                      <div className=" rounded-full  ">
                        <label
                          htmlFor="avatarUpload"
                          className="flex rounded-full w-fit items-end gap-3 my-4 text-[#5B8DEF] text-[16px]"
                        >
                          <>
                            <Image
                              src={selectedPics || userPic || defaultpic}
                              width={280}
                              height={180}
                              alt=""
                              className=" w-[140px] h-[140px]  rounded-full   bg-brand-green-ttr"
                            ></Image>
                          </>
                          Edit
                        </label>
                        <input
                          type="file"
                          name="profilepics"
                          id="avatarUpload"
                          className="hidden outline-none"
                          onChange={handleFileChange}
                        />
                      </div>

                      <AccountManagement />
                      <Twofa closeAcc={closeAcc} setCloseAcc={setCloseAcc} />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/*  Mobile and Desktop View*/}
        <div className="lg:hidden relative  container mx-auto">
          <div
            className="flex   flex-col items-start min-h-[50vh] font-manropeEB 
         px-6 md:items-center lg:hidden  gap-8 justify-start"
          >
            {!openEachSeting ? (
              <>
                <ul
                  className="flex gap-[48.5px] font-manropeL md:font-manropeB 
                 justify-start  md:justify-center text-[#737876]   text-[14px] md:text-[16px] text-semibold"
                >
                  <li
                    onClick={() => setShowReferInfo(false)}
                    className={`hover:text-brand-green-hover py-2 px-2  ${
                      !showReferInfo ? 'border-b-2 text-brand-green-primary   border-brand-green-primary' : ''
                    }`}
                  >
                    Settings
                  </li>
                  <li
                    onClick={() => setShowReferInfo(true)}
                    className={`hover:text-brand-green-hover px-2 py-2 ${
                      showReferInfo ? 'border-b-2 text-brand-green-primary  border-brand-green-primary' : ''
                    }`}
                  >
                    Invite a friend
                  </li>
                </ul>

                {showReferInfo ? (
                  <ul
                    className="flex flex-col text-[14px] md:text-[16px] font-manropeL
                  md:font-manropeB md:text-[#444846]  text-dark-110 w-full md:w-fit md:text-center 
             md:items-center items-start "
                  >
                    <li
                      onClick={() => {
                        changeSettingOptions('refer');
                      }}
                      className="pb-4 md:py-3 w-full
                       min-w-[50vw] text-[14px] md:text-[16px] hover:bg-brand-green-shade95 
                      border-b-[1px] border-white-500  md:text-[#444846] text-dark-110 "
                    >
                      Refer your friends
                    </li>
                  </ul>
                ) : (
                  <ul
                    className="flex flex-col text-[14px] md:text-[16px] font-manropeL
                     md:font-manropeB md:text-[#444846]  text-dark-110 w-full md:w-fit md:text-center 
                md:items-center items-start "
                  >
                    <li
                      onClick={() => {
                        changeSettingOptions('accountManagement');
                      }}
                      className="pb-4 md:py-3 w-full  
                       hover:bg-brand-green-shade95 min-w-[50vw]  border-b-[1px] border-white-500 "
                    >
                      Account Management
                    </li>
                    <li
                      onClick={() => {
                        changeSettingOptions('notificationSettings');
                      }}
                      className="py-4 md:py-3 w-full hover:bg-brand-green-shade95 min-w-[50vw] border-b-[1px] border-white-500 "
                    >
                      Notification Settings
                    </li>
                    <li
                      onClick={() => {
                        changeSettingOptions('deleteAccount');
                      }}
                      className="py-4  md:py-3 w-full border-b-[1px] md:border-none hover:bg-brand-green-shade95 min-w-[50vw] border-white-500 
                  "
                    >
                      Delete Account
                    </li>
                  </ul>
                )}
              </>
            ) : (
              <div className=" relative w-full">
                <p
                  className="py-2 mb-5 md:w-[80%]  font-manropeL w-full flex gap-[4px]
              text-md items-center justify-start border-b-[1px] border-slate-500 text-md"
                >
                  <button onClick={resetSettingOption} className=" flex  text-md items-center justify-start">
                    <ArrowLeft2 className="w-[16px] h-[16px]" />
                  </button>{' '}
                  {!showReferInfo ? ' Settings' : 'Invite a friend'}
                </p>
                <div className=" w-full relative mb-4 ">
                  {settingOption.notificationSettings && (
                    <NotificationSettings checkboxState={checkboxState} setCheckboxState={setCheckboxState} />
                  )}
                  {settingOption.deleteAccount && <DeleteAccount />}
                  {settingOption.accountManagement && (
                    <div>
                      {closeAcc && (
                        <>
                          <h3 className=" font-manropeEB text-[1rem] sm:text-[1.375rem] text-[#2E3130] leading-[1.75rem]">
                            Account Management
                          </h3>
                          <div className=" rounded-full  ">
                            <label
                              htmlFor="avatarUpload"
                              className="flex rounded-full w-fit items-end gap-3 my-4 text-[#5B8DEF] text-[16px]"
                            >
                              <>
                                <Image
                                  src={selectedPics || userPic || defaultpic}
                                  width={280}
                                  height={180}
                                  alt=""
                                  className=" w-[140px] h-[140px]  rounded-full  "
                                ></Image>
                              </>
                              Edit
                            </label>
                            <input
                              type="file"
                              onChange={handleFileChange}
                              name="profilepics"
                              id="avatarUpload"
                              className=" hidden outline-none"
                            />
                          </div>

                          <AccountManagementMobile />
                        </>
                      )}
                      <Twofa closeAcc={closeAcc} setCloseAcc={setCloseAcc} />
                    </div>
                  )}{' '}
                  {settingOption.refer && <InviteLink />}
                </div>
              </div>
            )}
          </div>
        </div>

        <Button
          //leftIcon={<I24Support color="#06C270" />}
          intent={'secondary'}
          onClick={settingOption.notificationSettings ? handleNotificationUpdate : undefined}
          size={'sm'}
          isLoading={loading}
          spinnerColor="#000"
          className={` text-[ 16px] my-[46px] lg:mr-[100px] md:mr-[32px] mr-[24px] border-[1px] border-[#009444] py-[16.5px] px-[20px] self-end 
          relative text-[#009444] rounded-[8px] 
           w-[139px] h-[52px] grow lg:block md:hidden ${showReferInfo && 'w-[77px] md:w-[139px]'} ${
             settingOption.accountManagement || settingOption.deleteAccount || settingOption.refer
               ? 'md:block lg:block hidden'
               : ''
           } ${settingOption.notificationSettings && 'md:block'}
           hover:bg-brand-green-hover hover:text-white-100 `}
        >
          Save <span className={` ${showReferInfo && 'hidden md b:inline'}`}>& Close </span>
        </Button>
      </div>
    </MainLayout>
  );
};
export default withAuth(SettingPage);
