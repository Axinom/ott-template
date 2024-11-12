import { QuickEditContext, QuickEditContextType } from '@axinom/mosaic-ui';
import React, { useContext } from 'react';
import { EntityType } from '../../../generated/graphql';
import { SnapshotData } from '../PublishingSnapshotExplorer/PublishingSnapshotExplorer.types';
import { PublishingSnapshotDetails } from './PublishingSnapshotDetails';

export interface PublishingSnapshotQuickEditProps {
  type: EntityType;
}
export const PublishingSnapshotQuickEdit: React.FC<
  PublishingSnapshotQuickEditProps
> = ({ type }) => {
  const { selectedItem } =
    useContext<QuickEditContextType<SnapshotData>>(QuickEditContext);

  return <PublishingSnapshotDetails snapshotId={selectedItem.id} type={type} />;
};
