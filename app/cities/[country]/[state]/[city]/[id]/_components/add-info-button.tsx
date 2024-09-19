import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export function AddInfoButton({
  name,
  value
}: {
  name: string;
  value: boolean;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">+</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            {/* <h4 className="font-medium leading-none">{name}</h4> */}
            <p className="text-sm text-muted-foreground">
              Is {name} available?
            </p>
          </div>
          <div className="grid gap-2">
            {/* {user ? ( */}
            <div className="grid grid-cols-3 items-center gap-4">
              <RadioGroup defaultValue={value}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={true} id="r1" />
                  <Label htmlFor="r1">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={false} id="r2" />
                  <Label htmlFor="r2">No</Label>
                </div>
                {value === null && (
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={null} id="r3" />
                    <Label htmlFor="r3">Unknown</Label>
                  </div>
                )}
              </RadioGroup>
            </div>
            {/* ) : (
                <p>Login to add details to this location.</p>
              )} */}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
