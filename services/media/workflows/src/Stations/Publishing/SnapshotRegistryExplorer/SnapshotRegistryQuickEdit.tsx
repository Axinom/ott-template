import { QuickEditContext, QuickEditContextType } from '@axinom/mosaic-ui';
import React, { useContext } from 'react';
import { PublishingSnapshotDetails } from '../PublishingSnapshotDetails/PublishingSnapshotDetails';
import { SnapshotData } from './SnapshotRegistry.types';

export const SnapshotRegistryQuickEdit: React.FC = () => {
  const { selectedItem } =
    useContext<QuickEditContextType<SnapshotData>>(QuickEditContext);

  return (
    <PublishingSnapshotDetails
      snapshotId={selectedItem.id}
      type={selectedItem.entityType}
    />
  );
};
