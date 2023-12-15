class donationDTO {
    constructor(donation) {
      this._id = donation._id;
      this.email = donation.email;
      this.phoneNumber = donation.phoneNumber;
      this.password = donation.password;
      this.companyFirstName = donation.companyFirstName;
      this.companySecondName = donation.companySecondName;
      this.companyLicenseNo = donation.companyLicenseNo;
      this.licenceExpiry = donation.licenceExpiry;
      this.ownerFirstName = donation.ownerFirstName;
      this.ownerLastName = donation.ownerLastName;
      this.cnicOrPassportNo = donation.cnicOrPassportNo;
      this.expiryDate = donation.expiryDate;
      this.companyAddress = donation.companyAddress;
      this.companyExperiences = donation.companyExperiences;
      this.state = donation.state;
      this.country = donation.country;
      this.website = donation.website;
      this.twitter = donation.twitter;
      this.facebook = donation.facebook;
      this.instagram = donation.instagram;
      this.incomeTaxNo = donation.incomeTaxNo;
      this.salesTaxNo = donation.salesTaxNo;
      this.bankName = donation.bankName;
      this.accountHolderName = donation.accountHolderName;
      this.accountNumber = donation.accountNumber;
      this.companyLogo = donation.companyLogo;
      this.licenseImage = donation.licenseImage;
      this.ownerImage = donation.ownerImage;
      this.cnicImage = donation.cnicImage;
      this.taxFileImage = donation.taxFileImage;
    }
  }
  module.exports = donationDTO;
