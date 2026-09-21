import { styled } from '@linaria/react';
import { themeCssVariables } from 'twenty-ui/theme-constants';

import { NavigationMenuItemDisplay } from '@/navigation-menu-item/display/components/NavigationMenuItemDisplay';
import type { NavigationMenuItemSectionListDndKitProps } from '@/navigation-menu-item/display/sections/types/NavigationMenuItemSectionListDndKitProps';
import { NavigationMenuItemType } from 'twenty-shared/types';
import type { NavigationMenuItem } from '~/generated-metadata/graphql';

const StyledList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.betweenSiblingsGap};
  padding-top: ${themeCssVariables.betweenSiblingsGap};
`;

const StyledSectionTitle = styled.div`
  color: var(--t-font-color-light);
  font-size: 11px;
  font-weight: var(--t-font-weight-semi-bold);
  padding: 8px 12px;
`;

type WorkspaceSectionListReadOnlyProps = Pick<
  NavigationMenuItemSectionListDndKitProps,
  'filteredItems' | 'folderChildrenById' | 'onActiveObjectMetadataItemClick'
>;

const READ_ONLY_EDIT_MODE_PROPS = {
  isSelectedInEditMode: false,
  onEditModeClick: undefined,
} as const;

export const WorkspaceSectionListReadOnly = ({
  filteredItems,
  folderChildrenById,
  onActiveObjectMetadataItemClick,
}: WorkspaceSectionListReadOnlyProps) => {
  const folderCount = filteredItems.filter(
    (item) => item.type === NavigationMenuItemType.FOLDER,
  ).length;
console.log(filteredItems);
  return (
    <StyledList>
      <StyledSectionTitle>OVERVIEW</StyledSectionTitle>

      {filteredItems.slice(3, 4).map((item: NavigationMenuItem) => (
        <NavigationMenuItemDisplay
          key={item.id}
          item={item}
          editModeProps={READ_ONLY_EDIT_MODE_PROPS}
          isDragging={false}
          folderChildrenById={folderChildrenById}
          folderCount={folderCount}
          onActiveObjectMetadataItemClick={onActiveObjectMetadataItemClick}
          readOnly
        />
      ))}

      <StyledSectionTitle>SALES</StyledSectionTitle>

      {filteredItems.slice(0, 3).map((item: NavigationMenuItem) => (
        <NavigationMenuItemDisplay
          key={item.id}
          item={item}
          editModeProps={READ_ONLY_EDIT_MODE_PROPS}
          isDragging={false}
          folderChildrenById={folderChildrenById}
          folderCount={folderCount}
          onActiveObjectMetadataItemClick={onActiveObjectMetadataItemClick}
          readOnly
        />
      ))}

      <StyledSectionTitle>SERVICE</StyledSectionTitle>

      {filteredItems.slice(4, 5).map((item: NavigationMenuItem) => (
        <NavigationMenuItemDisplay
          key={item.id}
          item={item}
          editModeProps={READ_ONLY_EDIT_MODE_PROPS}
          isDragging={false}
          folderChildrenById={folderChildrenById}
          folderCount={folderCount}
          onActiveObjectMetadataItemClick={onActiveObjectMetadataItemClick}
          readOnly
        />
      ))}

      {filteredItems.slice(7, 8).map((item: NavigationMenuItem) => (
        <NavigationMenuItemDisplay
          key={item.id}
          item={item}
          editModeProps={READ_ONLY_EDIT_MODE_PROPS}
          isDragging={false}
          folderChildrenById={folderChildrenById}
          folderCount={folderCount}
          onActiveObjectMetadataItemClick={onActiveObjectMetadataItemClick}
          readOnly
        />
      ))}

      <StyledSectionTitle>OPERATIONS</StyledSectionTitle>

      {filteredItems.slice(5, 7).map((item: NavigationMenuItem) => (
        <NavigationMenuItemDisplay
          key={item.id}
          item={item}
          editModeProps={READ_ONLY_EDIT_MODE_PROPS}
          isDragging={false}
          folderChildrenById={folderChildrenById}
          folderCount={folderCount}
          onActiveObjectMetadataItemClick={onActiveObjectMetadataItemClick}
          readOnly
        />
      ))}
    </StyledList>
  );
};
