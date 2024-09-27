import React from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

const PopupPlaceDeleted = ({
  showModal,
  setShowModal,
  cityId
}: {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  cityId: string;
}) => {
  const router = useRouter();
  const handleCloseModal = () => {
    setShowModal(false);
    router.push(`/places?city_id=${cityId}`);
  };

  return (
    <div>
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Location Not Available</DialogTitle>
            <DialogDescription>
              This location does not have onsite seating and has been
              automatically removed from the database.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button
                type="button"
                variant="secondary"
                onClick={handleCloseModal}
              >
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PopupPlaceDeleted;
