import React, { useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Facebook,
  Instagram,
  Mastodon,
  Tiktok,
  Twitter,
  Youtube,
  Globe,
  MapPin,
  Mail,
  LucideIcon // Add this import
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  facebook: Facebook,
  instagram: Instagram,
  mastodon: Mastodon,
  tiktok: Tiktok,
  twitter: Twitter,
  youtube: Youtube,
  website: Globe,
  'google maps': MapPin,
  email: Mail
};

const AddSocialLink = ({ name }: { name: string }) => {
  const [link, setLink] = useState('');
  const Icon = iconMap[name] || Globe; // Use Globe as a fallback icon

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // onSubmit(name, link);
    setLink('');
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="text-foreground bg-background hover:text-blue-500 transition-colors duration-200 cursor-pointer"
          title={`Add ${name} link`}
        >
          <Icon className="w-6 h-6 text-muted-foreground " />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-5 bg-background text-foreground">
        <form onSubmit={handleSubmit}>
          <p className="mb-4">
            <span className="font-bold">
              Add <span className="capitalize">{name}</span> for this location
            </span>
          </p>
          <div className="flex items-center space-x-2 mb-4">
            <Input
              type="text"
              placeholder={`Enter ${name} link`}
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="flex-grow bg-background text-foreground border border-foreground rounded px-3 py-2"
            />
          </div>
          <Button
            type="submit"
            disabled={!link}
            className="bg-foreground text-background"
          >
            Submit
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
};

export default AddSocialLink;
