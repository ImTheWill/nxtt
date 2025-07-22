'use client'

import React, { act } from 'react'
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from 'next/image';
import { Models } from "node-appwrite";
import { actionsDropdownItems } from '../constants/index';
import { Input } from './ui/input';
import Link from 'next/link';
import { constructDownloadUrl } from '@/lib/utils';
import { Button } from './ui/button';
import { deleteFile, renameFile, updateFileUsers } from '@/lib/actions/file.actions';
import { usePathname } from 'next/navigation';
import { FileDetails, ShareInput } from './ActionsModalContent';

function ActionDropdown({file}:{file: Models.Document}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdown, setIsDropdown] = useState(false);
  const [action, setAction] = useState<ActionType | null >(null);
  const [name, setName] = useState(file.name);
  const [isLoading, setIsLoading] = useState(false);
  const [emails, setEmails] = useState<string[]>([]); //for share action

  const handleRemoveUser = async (email: string) => {
    const updatedEmails = emails.filter((e) => e !== email);
    const success = await updateFileUsers({fileId: file.$id, emails: updatedEmails, path});
    if (success) {
      setEmails(updatedEmails);
      closeAllModals();
    } else {
      console.error("Failed to remove user");
      closeAllModals();
    }
  }
  const path = usePathname();


  const closeAllModals = () => {
    setIsModalOpen(false);
    setIsDropdown(false);
    setAction(null);
    setName(file.name);
    //set emails
    //this is for canceling the modal
  }
  const handleAction = async () => {
    if (!action) return;
    setIsLoading(true);
    let success = false;
    const actions = {
      rename: () => renameFile({fileId: file.$id, name, extension: file.extension, path}),
      share: () => updateFileUsers({fileId: file.$id, emails, path}),
      delete: () => deleteFile({fileId: file.$id, bucketFileId: file.bucketFileId, path}),
    }

    success = await actions[action.value as keyof typeof actions](); //keyof typeof actions denotes that it can only be those keys
    if(success) closeAllModals();
    setIsLoading(false);

  };


  const renderDialogContent = () => {
    if (!action) return null;
    const {value, label} = action;
    return (
    <DialogContent className='shad-dialog button'>
        <DialogHeader className='flex flex-col gap-3'>
          <DialogTitle className='text-center text-light-100'>{label}</DialogTitle>
          {value === 'rename' && (<Input type = "text" value = {name} onChange={(e)=>setName(e.target.value)}/>)
          
          }
          {value === 'details' && <FileDetails file = {file}/>
          }
          {value === 'share' && (
            <ShareInput file = {file} onInputChange = {setEmails} onRemove = {handleRemoveUser} />
          )}
          {value === 'delete' && (
            <p className='delete-confirmation'>
              Are you sure you want to delete this file? This action cannot be undone.
              <span className='delete-file-name'>
                {file.name}
              </span>?
            </p>
          )}
        </DialogHeader>
        {['rename', 'share', 'delete'].includes(value) && (
          <DialogFooter className='flex flex-col gap-3 md:flex-row'>
            <Button onClick={closeAllModals} className='modal-cancel-button'> Cancel</Button>
            <Button onClick={handleAction} className='modal-submit-button' disabled={isLoading}> 
              <p className='capitalize'>{value}</p>
              {isLoading && <Image src = "/assets/icons/loader.svg" alt = "loader" width={24} height={24} className='animate-spin'/>}
            </Button>
          </DialogFooter>
        )}
    </DialogContent>
    )
  }


  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DropdownMenu open={isDropdown} onOpenChange={setIsDropdown}>
        <DropdownMenuTrigger className='shad-no-foucus'>
          <Image src = "/assets/icons/dots.svg" alt = "dots" width={34} height={34}/>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className='max-w-[200px] truncate'>{file.name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {actionsDropdownItems.map((actionItem) => (
            <DropdownMenuItem key = {actionItem.value} className='shad-dropdown-item' onClick={() => {
                setAction(actionItem);
                if(['rename', 'share', 'delete', 'details'].includes(actionItem.value)) {
                  setIsModalOpen(true);
                }}
              }
            >
              {actionItem.value === 'download'? (<Link href = {constructDownloadUrl(file.bucketFileId)} download = {file.name} className='flex items-center gap-2'>
                <Image src = {actionItem.icon} alt = {actionItem.label} width={30} height={30}/>
                {actionItem.label}
              </Link>): (
                <div className='flex items-center gap-2'>
                  <Image src = {actionItem.icon} alt = {actionItem.label} width={30} height={30}/>
                  {actionItem.label}
                </div>
              )
              }
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {renderDialogContent()}
    </Dialog>
  )
}

export default ActionDropdown

