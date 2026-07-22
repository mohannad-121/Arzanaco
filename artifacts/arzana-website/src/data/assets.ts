import logo from '@logos/arz-logo.png';
import rmu from '@photos/RMU.jpg';
import smartRmu from '@photos/Smar RMU.jpg';
import dryTransformer from '@photos/MV-LV Dry Transformer.jpg';
import telecomShelter from '@photos/Telecom Shelter.jpg';
import mvPanelTesting from '@photos/MV Panel testing.jpg';
import transformerTesting from '@photos/Transformer testing.jpg';
import loadingPlatform from '@photos/Loading platform.jpg';
import shaftGate from '@photos/Shaft Gate.jpg';

export const officialLogo = logo;

/** Only confidently matched product photos are listed here. */
export const productImageBySlug: Record<string, string> = {
  'ring-main-unit-rmu': rmu,
  'metering-rmu': smartRmu,
  'dry-type-transformer': dryTransformer,
  'telecommunication-shelter': telecomShelter,
  'loading-platforms': loadingPlatform,
  'shaft-gates': shaftGate,
};

export const approvedImages = {
  powerDistribution: rmu,
  testing: mvPanelTesting,
  engineering: transformerTesting,
  safety: loadingPlatform,
} as const;
