import constants from '../config/constants.mjs';
import ErrorCode from '../errors/error-code.mjs';
import IdentifiedError from '../errors/identified-error.mjs';
import InvitationModel from '../models/invitation-model.mjs';
import { generateInvitationCode } from '../utils/code.mjs';
import * as userService from './user-service.mjs';

export async function getByOwner(ownerId) {
  return InvitationModel.find({ owner: ownerId });
}

export async function countByOwner(ownerId) {
  return InvitationModel.countDocuments({ owner: ownerId });
}

export async function getByCode(code) {
  return InvitationModel.findOne({ code });
}

export async function createMany({
  ownerId = null,
  email = null,
  amount = 1,
  reusable = false,
  expirationDate = null,
}) {
  let owner = ownerId;

  if (owner) {
    owner = await userService.getById(ownerId);
    if (!owner) {
      throw new IdentifiedError(
        ErrorCode.INVALID_USER,
        'Este usuario no existe'
      );
    }

    const count = await countByOwner(ownerId);
    if (count >= constants.MAXIMUM_USER_INVITATIONS) {
      throw new IdentifiedError(
        ErrorCode.MAXIMUM_USER_INVITATIONS,
        'No puedes crear más invitaciones'
      );
    }

    owner.email = email;
    await owner.save();
  }

  const invitations = [];

  for (let i = 0; i < amount; i++) {
    let code = '';
    let unique = false;

    while (!unique) {
      code = generateInvitationCode();
      const existsInvitation = await InvitationModel.findOne({ code });
      if (!existsInvitation) {
        unique = true;
      }
    }

    const invitation = await InvitationModel.create({
      owner,
      code,
      expirationDate,
      reusable,
    });

    invitations.push(invitation);
  }

  return invitations;
}
