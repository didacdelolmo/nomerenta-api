import constants from '../config/constants.mjs';
import * as invitationService from '../services/invitation-service.mjs';

export async function getCurrentUserInvitations(req, res) {
  res.send(await invitationService.getByOwner(req.session.userId));
}

export async function createCurrentUserInvitations(req, res) {
  res.send(
    await invitationService.createMany(
      req.session.userId,
      req.body.email,
      constants.DEFAULT_USER_INVITATIONS
    )
  );
}
