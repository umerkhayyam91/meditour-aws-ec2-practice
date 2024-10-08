class LabDTO {
  constructor(lab) {
    this._id = lab._id;
    this.email = lab.email;
    this.phoneNumber = lab.phoneNumber;
    this.password = lab.password;
    this.labFirstName = lab.labFirstName;
    this.labLastName = lab.labLastName;
    this.loc = lab.loc;
    this.labLicenseNumber = lab.labLicenseNumber;
    this.OwnerName = lab.OwnerName;
    this.cnicOrPassportNo = lab.cnicOrPassportNo;
    this.labAddress = lab.labAddress;
    this.emergencyNo = lab.emergencyNo;
    this.state = lab.state;
    this.country = lab.country;
    this.website = lab.website;
    this.twitter = lab.twitter;
    this.facebook = lab.facebook;
    this.instagram = lab.instagram;
    this.incomeTaxNo = lab.incomeTaxNo;
    this.salesTaxNo = lab.salesTaxNo;
    this.bankName = lab.bankName;
    this.accountHolderName = lab.accountHolderName;
    this.accountNumber = lab.accountNumber;
    this.labLogo = lab.labLogo;
    this.labLicenseImage = lab.labLicenseImage;
    this.taxFileImage = lab.taxFileImage;
    this.cnicImage = lab.cnicImage;
    this.description = lab.description;
    this.availabilityDuration = lab.availabilityDuration;
    this.availability = lab.availability;
    this.averageRating = lab.averageRating;
    this.fcmToken = lab.fcmToken;
  }
}

module.exports = LabDTO;
