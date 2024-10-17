import React from 'react';
import { Place } from '@/utils/types';
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Globe,
  MapPin,
  Mail
} from 'lucide-react';
import AddSocialLink from './social-link-add-button';

const SocialLinks = ({ place }: { place: Place }) => {
  const {
    facebook,
    instagram,
    tiktok,
    mastodon,
    twitter,
    youtube,
    website,
    google_maps,
    email
  } = place;

  const socials = [
    {
      name: 'facebook',
      link: facebook,
      icon: Facebook,
      color: 'text-blue-400'
    },
    {
      name: 'instagram',
      link: instagram,
      icon: Instagram,
      color: 'text-pink-400'
    },
    { name: 'mastodon', link: mastodon, icon: Globe, color: 'text-blue-400' },
    { name: 'tiktok', link: tiktok, icon: Globe, color: 'text-pink-400' },
    { name: 'twitter', link: twitter, icon: Twitter, color: 'text-indigo-400' },
    { name: 'youtube', link: youtube, icon: Youtube, color: 'text-red-400' },
    { name: 'website', link: website, icon: Globe, color: 'text-blue-400' },
    {
      name: 'google maps',
      link: google_maps,
      icon: MapPin,
      color: 'text-green-400'
    },
    { name: 'email', link: email, icon: Mail, color: 'text-red-400' }
  ];

  return (
    <div className="flex flex-row flex-wrap gap-4 mt-4 items-center">
      <p className="font-bold">Social Links:</p>
      {socials.map((social, index) =>
        social.link && social.link.length > 0 ? (
          <a
            key={index}
            href={social.link}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-500 transition-colors duration-200"
            title={`${social.name} for ${place.city} ${place.name} `}
          >
            <social.icon
              className={`w-6 h-6 text-foreground ${social.color}`}
            />
          </a>
        ) : (
          <AddSocialLink key={index} name={social.name} />
        )
      )}
    </div>
  );
};

export default SocialLinks;
