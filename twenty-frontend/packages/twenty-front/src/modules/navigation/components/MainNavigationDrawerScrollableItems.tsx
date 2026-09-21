import { styled } from '@linaria/react';
import { useLocation } from 'react-router-dom';
import { themeCssVariables } from 'twenty-ui/theme-constants';
import { NotificationCounter } from 'twenty-ui/data-display';
import {
  IconLayoutDashboard,
  IconCheckbox,
  IconTarget,
  IconBriefcase,
  IconSun,
  IconTag,
  IconInbox,
  IconTool,
  IconCheck,
  IconBolt,
  IconChartBar,
  IconSettings
} from 'twenty-ui/icon';

import { NavigationDrawerSection } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerSection';
import { NavigationDrawerSectionTitle } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerSectionTitle';
import { NavigationDrawerItem } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerItem';

const StyledScrollableItemsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[3]};
  height: 100%;
`;

const StyledFooter = styled.div`
  margin-top: auto;
  padding: ${themeCssVariables.spacing[4]} ${themeCssVariables.spacing[4]};
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[1]};
  font-size: ${themeCssVariables.font.size.sm};
  color: ${themeCssVariables.font.color.light};
`;

const FooterTitle = styled.div`
  font-weight: ${themeCssVariables.font.weight.semiBold};
  color: ${themeCssVariables.font.color.primary};
`;

const FooterStatus = styled.div`
  display: flex;
  align-items: center;
  gap: ${themeCssVariables.spacing[1]};
`;

const StatusDot = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #10b981;
`;

export const MainNavigationDrawerScrollableItems = () => {
  const { pathname } = useLocation();

  return (
    <StyledScrollableItemsContainer>
      <NavigationDrawerSection>
        <NavigationDrawerSectionTitle label="OVERVIEW" />
        <NavigationDrawerItem label="Dashboard" Icon={IconLayoutDashboard} to="/objects/dashboards" />
        <NavigationDrawerItem label="My Tasks" Icon={IconCheckbox} to="/objects/tasks" />
      </NavigationDrawerSection>

      <NavigationDrawerSection>
        <NavigationDrawerSectionTitle label="SALES" />
        <NavigationDrawerItem label="Leads" Icon={IconTarget} to="/objects/leads" active={pathname.startsWith('/objects/leads')} />
        <NavigationDrawerItem label="Deals" Icon={IconBriefcase} to="/objects/opportunities" active={pathname.startsWith('/objects/opportunities') || pathname.startsWith('/objects/deals')} />
        <NavigationDrawerItem label="Customers" Icon={IconSun} to="/objects/companies" />
      </NavigationDrawerSection>

      <NavigationDrawerSection>
        <NavigationDrawerSectionTitle label="SERVICE" />
        <NavigationDrawerItem label="Tickets" Icon={IconTag} to="/objects/tickets" rightOptions={<NotificationCounter count={4} variant="primary" />} alwaysShowRightOptions />
        <NavigationDrawerItem label="Inbox" Icon={IconInbox} to="/inbox" rightOptions={<NotificationCounter count={12} variant="primary" />} alwaysShowRightOptions />
        <NavigationDrawerItem label="Field Service" Icon={IconTool} to="/field-services" />
      </NavigationDrawerSection>

      <NavigationDrawerSection>
        <NavigationDrawerSectionTitle label="OPERATIONS" />
        <NavigationDrawerItem label="Approvals" Icon={IconCheck} to="/approvals" rightOptions={<NotificationCounter count={3} variant="primary" />} alwaysShowRightOptions />
        <NavigationDrawerItem label="Automations" Icon={IconBolt} to="/automations" />
        <NavigationDrawerItem label="Reports" Icon={IconChartBar} to="/objects/dashboards" active={pathname.startsWith('/objects/dashboards')} />
        <NavigationDrawerItem label="Administration" Icon={IconSettings} to="/settings" />
      </NavigationDrawerSection>

    </StyledScrollableItemsContainer>
  );
};
