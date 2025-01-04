import React from 'react';
import styled from 'styled-components';
import { PopupOverlay, PopupContent, PopupClose } from './Popup';

const Label = styled.div`
  color: rgb(108, 118, 147);
  margin-bottom: 8px;
`;

const DetailRow = styled.div`
  margin-bottom: 16px;
`;

const BadgeContainer = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const Badge = styled.span`
  background: ${props => props.color};
  color: white;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 14px;
`;

const RemoveButton = styled.button`
  width: 100%;
  margin-top: 24px;
  padding: 12px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: #c82333;
  }
`;

const GuestDetailsPopup = ({ guest, onClose, onRemove, showRemoveButton = false }) => {
  return (
    <>
      <PopupOverlay onClick={onClose} />
      <PopupContent>
        <PopupClose onClick={onClose}>×</PopupClose>
        
        <DetailRow>
          <Label>Name</Label>
          {guest.name}
        </DetailRow>

        <DetailRow>
          <Label>Type</Label>
          <BadgeContainer>
            {!guest.isGuest && !guest.isChild && <Badge color="#4a6741">Main Guest</Badge>}
            {guest.isGuest && <Badge color="#7d9a74">Additional Guest</Badge>}
            {guest.isChild && <Badge color="#9747FF">Child</Badge>}
          </BadgeContainer>
        </DetailRow>

        {guest.isGuest && (  
          <DetailRow>
            <Label>Guest Of</Label>
            {guest.broughtBy}
          </DetailRow>
        )}

        {guest.isVegetarian && (
          <DetailRow>
            <Label>Dietary Requirements</Label>
            <Badge color="#4CAF50">Vegetarian</Badge>
          </DetailRow>
        )}

        {showRemoveButton && (
          <RemoveButton onClick={onRemove}>
            Remove from Seat
          </RemoveButton>
        )}
      </PopupContent>
    </>
  );
};

export default GuestDetailsPopup; 