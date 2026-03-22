import { ClaimStatus } from '../types';

export const getClaimStatusVariant = (status: ClaimStatus) => {
  if (status === 'APPROVED') return 'approved';
  if (status === 'REJECTED') return 'rejected';
  if (status === 'CANCELLED') return 'cancelled';
  return 'pending';
};

export const getClaimStatusLabel = (status: ClaimStatus) =>
  status.charAt(0) + status.slice(1).toLowerCase();
