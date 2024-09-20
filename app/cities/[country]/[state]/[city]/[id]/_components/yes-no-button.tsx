import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function YesNoButton({
  name,
  value
}: {
  name: string;
  value: boolean;
}) {


  const user = getUser()

  return (
    <div>
      <p>
        <span className="font-bold">{name}</span> at this location
      </p>
      <div className="flex items-center space-x-2 p-2">
        <Button
          variant={buttonValue === true ? 'default' : 'outline'}
          size="icon"
          onClick={() => {
            buttonValue === true ? setButtonValue(null) : setButtonValue(true);
          }}
        >
          <span
            className={buttonValue === true ? 'text-white' : 'text-gray-500'}
          >
            Yes
          </span>
        </Button>
        <Button
          variant={buttonValue === false ? 'default' : 'outline'}
          size="icon"
          onClick={() => {
            buttonValue === false
              ? setButtonValue(null)
              : setButtonValue(false);
          }}
        >
          <span
            className={buttonValue === false ? 'text-white' : 'text-gray-500'}
          >
            No
          </span>
        </Button>
      </div>
    </div>
  );
}
