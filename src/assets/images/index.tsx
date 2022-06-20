import { Source } from "react-native-fast-image";
// const AppImages: ImageObject = require('../data/images.json')['images'];

const imagesDirectory = "./";
const AppImages: { [key: string]: Source | any } = {
  logo_short: require(`${imagesDirectory}/logo_short.jpg`),
  logo: require(`${imagesDirectory}/logo.png`),
  logo_white: require(`${imagesDirectory}/logo_white.png`),
  message: require(`${imagesDirectory}/message.png`),
  landing_background: require(`${imagesDirectory}/onboarding_1280x752_landscape.jpg`),
  search: require(`${imagesDirectory}/search.png`),
  settings: require(`${imagesDirectory}/settings.png`),
  settings_grey: require(`${imagesDirectory}/settings_grey.png`),
  viewMore: require(`${imagesDirectory}/ViewMore.png`),
  avatar: require(`${imagesDirectory}/avatar.png`),
  icon_add: require(`${imagesDirectory}/icon_add.png`),
  profile: require(`${imagesDirectory}/profile.png`),
  tick_active: require(`${imagesDirectory}/Mask.png`),
  space_png: require(`${imagesDirectory}/space.png`),
  delete_png: require(`${imagesDirectory}/delete.png`),
  profile_pic_1: require(`${imagesDirectory}/profile_pic_1.png`),
  profile_pic_2: require(`${imagesDirectory}/profile_pic_2.png`),
  profile_pic_3: require(`${imagesDirectory}/profile_pic_3.png`),
  profile_pic_4: require(`${imagesDirectory}/profile_pic_4.png`),
  profile_pic_5: require(`${imagesDirectory}/profile_pic_5.png`),
  profile_pic_6: require(`${imagesDirectory}/profile_pic_6.png`),
  profile_pic_7: require(`${imagesDirectory}/profile_pic_7.png`),
  profile_pic_8: require(`${imagesDirectory}/profile_pic_8.png`),
  selected: require(`${imagesDirectory}/selected.png`),
  edit: require(`${imagesDirectory}/edit.png`),
  arrow_right: require(`${imagesDirectory}/arrow_right.png`),
  tvshowPlaceholder:
    "https://ottapp-appgw-client-a.dev.mr.tv3cloud.com/htmlapp/20220525-6bd4d23-6-master-mr-int/images/Genre/tvshow_placeholder_94x141.jpg",
  placeholder: require(`${imagesDirectory}/placeholder.png`),
  checked_circle: require(`${imagesDirectory}/checked_circle.png`),
  unchecked_circle: require(`${imagesDirectory}/unchecked_circle.png`),
  topGradient: require(`${imagesDirectory}/top_gradient.png`),
  bottomGradient: require(`${imagesDirectory}/bottomGradient.png`),
};

export { AppImages };
