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
    { name: 'facebook', link: facebook, icon: Facebook },
    { name: 'instagram', link: instagram, icon: Instagram },
    { name: 'mastodon', link: mastodon, icon: Globe },
    { name: 'tiktok', link: tiktok, icon: Globe },
    { name: 'twitter', link: twitter, icon: Twitter },
    { name: 'youtube', link: youtube, icon: Youtube },
    { name: 'website', link: website, icon: Globe },
    { name: 'google maps', link: google_maps, icon: MapPin },
    { name: 'email', link: email, icon: Mail }
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
            <social.icon className="w-6 h-6 text-foreground" />
          </a>
        ) : (
          <AddSocialLink key={index} name={social.name} />
        )
      )}
    </div>
  );
};

export default SocialLinks;
