import Button from '@ui/Button';
import React, { useEffect, useState } from 'react';
import { Input } from '@ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@ui/SelectInput';
import Modal from '@ui/Modal';
import { Add, CloseSquare } from 'iconsax-react';
import useDisclosure from '../../../hooks/useDisclosure';
import axios from 'axios';
import { sendArrayOfObjects } from '../functions/sendArrayOfObjects';
import { notify } from '@ui/Toast';
import { Trash } from 'iconsax-react';
import Loader from '@ui/Loader';

const generateUniqueId = () => {
  const timestamp = new Date().getTime();
  const randomNumber = Math.floor(Math.random() * 10000);
  return `id-${timestamp}-${randomNumber}`;
};

type contactModalProps = {
  onCloseModal: () => void;
  onSaveModal: () => void;
  isOpen: boolean;
  userId: string;
};

function ContactModal({ isOpen, onCloseModal, onSaveModal, userId }: contactModalProps) {
  const [email, setEmail] = useState('');
  const [url, setUrl] = useState('');
  const [socials, setSocials] = useState<any[]>([]);
  const [socialmediaid, setSocialMediaId] = useState('');
  const [isForm, setIsForm] = useState(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [availableSocials, setAvailableSocials] = useState<{ Id: number; name: string }[] | []>([]);

  const handleAddNewSocial = () => {
    setSocials((prevValues) => [
      ...prevValues,
      {
        user_id: userId,
        url: '',
        social_media_id: 1,
      },
    ]);
  };

  const handleSocialInputChange = (index: number, newValue: string) => {
    // Creates a new array with the updated content for the specific input
    const updatedData = [...socials];
    updatedData[index] = { ...updatedData[index], url: newValue };

    // Update the state with the new array
    setSocials(updatedData);
  };
  // const handleSocialInputChange = (id: string, newValue: string) => {
  //   // Find the index of the object with the matching id
  //   const index = socials.findIndex((item) => item.id === id);

  //   if (index !== -1) {
  //     // Creates a new array with the updated content for the specific input
  //     const updatedData = [...socials];
  //     updatedData[index] = { ...updatedData[index], url: newValue };

  //     // Update the state with the new array
  //     setSocials(updatedData);
  //   }
  // };
  const handleSocialSelectChange = (newId: number, index: number) => {
    const updatedData = [...socials];
    updatedData[index] = {
      ...updatedData[index],
      social_media_id: newId,
      user_id: userId,
    };
    setSocials(updatedData);
  };

  const handleSocialDelete = (id: string) => {
    // Filter out the object with the specified id to delete it
    const filteredData = socials.filter((item) => item.id !== id);

    // Update the state with the filtered array
    setSocials(filteredData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const data = socials.map((social) => ({
      url: social.url,
      social_media_id: social.social_media_id,
      user_id: userId, // Ensure you have the userId available
    }));

    sendArrayOfObjects(data, 'https://hng6-r5y3.onrender.com/api/v1/contacts')
      .then((response: any) => {
        setLoading(false);
        notify({
          message: 'Contact created successfully',
          position: 'top-center',
          theme: 'light',
          type: 'success',
        });
        console.log('responseresponseresponseresponse', response);
        onSaveModal();
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        if (err.response.data.message.includes('contact already exists')) {
          notify({
            message: 'Contact already exists',
            position: 'top-center',
            theme: 'light',
            type: 'error',
          });
        }
        notify({
          message: 'Error occurred',
          position: 'top-center',
          theme: 'light',
          type: 'error',
        });
      });
  };
  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('delete clicked');
    const id = 5;
    try {
      const res = await fetch(`https://hng6-r5y3.onrender.com/api/v1/contacts/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(id),
      });
    } catch (err) {
      console.log('error', err);
    }
  };
  const toggleForm = () => {
    setIsForm(true);
  };

  const getSocialsAvailable = async () => {
    try {
      const response = await axios.get(`https://hng6-r5y3.onrender.com/api/v1/socials`);
      const data = await response.data;
      console.log('getSocialsAvailable', data);
      setAvailableSocials(data?.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getSocialsAvailable();
  }, []);

  useEffect(() => {
    console.log(socials);
  }, [socials]);

  const getAllSocials = async () => {
    try {
      const response = await axios.get(`https://hng6-r5y3.onrender.com/api/v1/contacts/${userId}`);
      const data = await response.data;
      console.log('responseData', data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllSocials();
  }, []);

  return (
    <>
      <Modal isOpen={isOpen} closeModal={onCloseModal} isCloseIconPresent={false} size="xl">
        <div className="space-y bg-white-100 sm:p-10">
          <form className="flex flex-col ">
            <div className="flex flex-col gap-3 mb-4">
              <div className="flex justify-between items-center">
                <p className="text-[1.2rem] sm:text-[1.5rem] font-bold text-[#2E3130] font-manropeL">Contact</p>
                <CloseSquare
                  size="32"
                  color="#009254"
                  variant="Bold"
                  onClick={onCloseModal}
                  className="cursor-pointer"
                />
              </div>
              <div className="bg-brand-green-primary h-1 rounded-sm"></div>
            </div>
            ​
            <div className="flex mx-auto flex-col gap-[.5rem] w-full sm:w-[90%]">
              <label className="font-semibold text-[#444846] text-[.9rem]">
                Email <span className="text-red-300">*</span>
              </label>
              <Input
                placeHolder="Enter email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                className="border-[#E1E3E2] border w-[100%] font-manropeL rounded-md  mb-3"
                inputSize={'sm'}
              />
            </div>
            {socials.length > 0 &&
              socials.map((social, index) => (
                <form key={index} onSubmit={handleSubmit} className="flex flex-col gap-y-5">
                  <div className="flex flex-col sm:flex-row items-center justify-between mx-auto w-full sm:w-[90%]  sm:gap-2 gap-5">
                    <div className="flex flex-col sm:flex-row items-center justify-between mx-auto w-full sm:w-[90%]  sm:gap-2 gap-5">
                      <div className="w-full">
                        <label className="font-semibold text-[#444846] text-[.9rem] mb-10">Select social</label>
                        <Select
                          onValueChange={(value: string) => {
                            const selectedSocial = availableSocials.find((socialItem) => socialItem.name === value);
                            if (selectedSocial) {
                              handleSocialSelectChange(selectedSocial.Id, index);
                            }
                          }}
                        >
                          <SelectTrigger className="border-[#E1E3E2] w-[100%] border text-xs font-manropeL">
                            <SelectValue placeholder="Select Social" />
                          </SelectTrigger>
                          <SelectContent className="border-[#E1E3E2]">
                            {availableSocials.map((socialItem, index) => (
                              <SelectItem
                                className="capitalize hover:bg-[#F4FBF6] hover:text-[#009254]"
                                key={index}
                                value={socialItem.name}
                              >
                                {socialItem.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex flex-col justify-center w-[100%] h-full">
                      <label className="font-semibold text-[#444846] text-[.9rem] mb-[.1rem]">Link to social</label>
                      <div className="flex rounded-md justify-center items-center border h-[2.5rem] border-[#E1E3E2]">
                        {/* <span className="font-manropeL w-1/3 text-xs text-center">Type link</span> */}
                        <Input
                          placeHolder="Enter social link"
                          onChange={(e) => {
                            handleSocialInputChange(index, e.target.value);
                          }}
                          className="border-[#E1E3E2] w-[100%] rounded-none border-0 border-s h-full text-xs font-manropeL"
                          inputSize={'sm'}
                          value={social.url}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb- font-manropeL mx-auto w-full sm:w-[90%] text-right">
                    <span
                      className="font-semibold cursor-pointer text-brand-red-hover"
                      onClick={() => handleSocialDelete(social.id)}
                    >
                      <Trash size="20" color="#f47373" variant="Outline" />
                    </span>
                  </div>
                  <hr className="mb-6 border-t-1 border-[#E1E3E2] mx-auto w-full sm:w-[90%]" />
                </form>
              ))}
          </form>

          <div className="flex justify-between flex-col sm:flex-row mt-3 gap-3 sm:w-[90%] mx-auto">
            <button
              className="text-brand-green-primary sm:self-center text-[14px] sm:text-[13px] flex items-center gap-1 font-semibold font-manropeB"
              onClick={handleAddNewSocial}
            >
              <Add size="16" color="#009254" /> Add new social
            </button>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                type="button"
                onClick={onCloseModal}
                intent={'secondary'}
                className="border w-full rounded-md sm:w-[4.5rem] sm:h-[2.5rem]"
                size={'sm'}
              >
                Cancel
              </Button>
              <Button
                // disabled={loading}
                type="submit"
                className={`${loading ? 'opacity-50' : 'opacity-100'} w-full rounded-md sm:w-[4.5rem] sm:h-[2.5rem]`}
                size={'sm'}
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? <Loader /> : 'Save'}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
      {/* <Button onClick={onOpen} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        Open Modal
      </Button> */}
    </>
  );
}
export default ContactModal;
