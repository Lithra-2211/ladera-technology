import { currentWorkspaceState } from '@/auth/states/currentWorkspaceState';
import {
  StyledContainer,
  StyledIconChevronDown,
  StyledLabel,
  StyledLabelWrapper,
} from '@/ui/navigation/navigation-drawer/components/MultiWorkspaceDropdown/internal/MultiWorkspacesDropdownStyles';
import { NavigationDrawerAnimatedCollapseWrapper } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerAnimatedCollapseWrapper';
import { DEFAULT_WORKSPACE_LOGO } from '@/ui/navigation/navigation-drawer/constants/DefaultWorkspaceLogo';
import { useIsNavigationDrawerContentExpanded } from '@/navigation/hooks/useIsNavigationDrawerContentExpanded';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { getAbsoluteImageUrl } from '~/utils/image/getAbsoluteImageUrl';
import { useContext } from 'react';
import { Avatar } from 'twenty-ui/data-display';
import { ThemeContext } from 'twenty-ui/theme-constants';

type MultiWorkspaceDropdownClickableComponentProps = {
  disabled?: boolean;
  shouldHideLabel?: boolean;
};

export const MultiWorkspaceDropdownClickableComponent = ({
  disabled,
  shouldHideLabel = false,
}: MultiWorkspaceDropdownClickableComponentProps) => {
  const { theme } = useContext(ThemeContext);
  const currentWorkspace = useAtomStateValue(currentWorkspaceState);

  const isNavigationDrawerExpanded = useIsNavigationDrawerContentExpanded();
  return (
    <StyledContainer
      data-testid="workspace-dropdown"
      isNavigationDrawerExpanded={isNavigationDrawerExpanded}
      disabled={disabled}
    >
      {isNavigationDrawerExpanded ? (
        <img 
          src="/ladera-logo.png" 
          alt="Ladera Technology" 
          style={{ 
            height: '36px', 
            width: 'auto',
            objectFit: 'contain',
            maxWidth: '100%',
            display: 'block',
            opacity: 1,
            filter: 'brightness(1.15)'
          }} 
        />
      ) : (
        <img 
          src="/lt-logo.png" 
          alt="LT Logo" 
          style={{ 
            height: '36px', 
            width: '36px',
            objectFit: 'contain',
            display: 'block',
            borderRadius: '4px',
            opacity: 1,
            filter: 'brightness(1.15)'
          }} 
        />
      )}
    </StyledContainer>
  );
};
