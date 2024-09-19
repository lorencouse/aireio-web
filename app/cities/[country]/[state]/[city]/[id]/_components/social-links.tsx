//   facebook?: string;
//   instagram?: string;
//   mastodon?: string;
//   tiktok?: string;
//   twitter?: string;
//   youtube?: string;
//   email?: string;
//   website?: string;
//   google_maps?: string;

import React from 'react';

import { Place } from '@/utils/types';

const SocialLinks = ({ place }: { place: Place }) => {
  const { facebook, instagram, mastodon, tiktok, twitter, youtube } = place;
  // social links object to array { name: 'facebook', link: facebook }
  const socialLinks = [
    { name: 'facebook', link: facebook },
    { name: 'instagram', link: instagram },
    { name: 'mastodon', link: mastodon },
    { name: 'tiktok', link: tiktok },
    { name: 'twitter', link: twitter },
    { name: 'youtube', link: youtube },
    { name: 'website', link: place.website },
    { name: 'google maps', link: place.google_maps },
    { name: 'email', link: place.email },
  ]

  return (

          <div key={index} className="flex flex-row items-center space-x-2">
    {socialLinks.map((link, index) => (
        <Icon name="link" className="w-5 h-5" />
        <a
          href={link.link}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline">{link.name}</a>
    ))}
  </div> 
  )



    } 

export default SocialLinks;
