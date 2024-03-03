import * as invitationService from '../../src/services/invitation-service.mjs';
import InvitationModel from '../../src/models/invitation-model.mjs';

class InvitationFixture {
  _id;
  code;
  ownerId;
  email;
  amount;
  reusable;
  expirationDate;

  constructor(ownerId, email, reusable, expirationDate) {
    this.ownerId = ownerId;
    this.email = email;
    this.amount = 1;
    this.reusable = reusable;
    this.expirationDate = expirationDate;
  }

  static async create({
    ownerId = null,
    email = null,
    reusable = false,
    expirationDate = null,
  }) {
    const invitation = new this(ownerId, email, reusable, expirationDate);
    await invitation.insert();
    return invitation;
  }

  static async clean() {
    return InvitationModel.deleteMany({});
  }

  async get() {
    return invitationService.getById(this._id);
  }

  async insert() {
    const { ownerId, email, amount, reusable, expirationDate } = this;

    const invitations = await invitationService.createMany({
      ownerId,
      email,
      amount,
      reusable,
      expirationDate,
    });

    this._id = invitations[0]._id.toString();
    this.code = invitations[0].code;
  }
}

export default InvitationFixture;
