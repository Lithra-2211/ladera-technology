import { type NavigationMenuItem } from '~/generated-metadata/graphql';

// export const getLinkNavigationMenuItemLabel = (
//   item: Pick<NavigationMenuItem, 'name' | 'link'>,
// ): string => {
//   const linkUrl = (item.link ?? '').trim();
//   return (item.name ?? linkUrl) || 'Link';
// };
export const getLinkNavigationMenuItemLabel = (
  item: Pick<NavigationMenuItem, 'name' | 'link'>,
): string => {
  const linkUrl = (item.link ?? '').trim();
  const label = (item.name ?? linkUrl) || 'Link';

  if (label === 'Workflows') {
    return 'Automations';
  }

  return label;
};
