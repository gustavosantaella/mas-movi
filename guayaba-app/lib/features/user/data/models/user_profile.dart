class UserProfile {
  final int id;
  final String firstName;
  final String lastName;
  final String email;
  final String dni;
  final String sex;
  final String dateOfBirth;
  final List<int> userType;
  final bool emailConfirmed;
  final bool entityConfirmed;
  final int status;
  final double balance;
  final String createdAt;

  const UserProfile({
    required this.id,
    required this.firstName,
    required this.lastName,
    required this.email,
    required this.dni,
    required this.sex,
    required this.dateOfBirth,
    required this.userType,
    required this.emailConfirmed,
    required this.entityConfirmed,
    required this.status,
    required this.balance,
    required this.createdAt,
  });

  bool get isDriver => userType.contains(3);

  factory UserProfile.fromJson(Map<String, dynamic> json) => UserProfile(
        id: json['id'] as int,
        firstName: json['firstName'] as String? ?? '',
        lastName: json['lastName'] as String? ?? '',
        email: json['email'] as String? ?? '',
        dni: json['dni'] as String? ?? '',
        sex: json['sex'] as String? ?? '',
        dateOfBirth: json['dateOfBirth'] as String? ?? '',
        userType: (json['userType'] as List?)?.cast<int>() ?? [],
        emailConfirmed: json['emailConfirmed'] as bool? ?? false,
        entityConfirmed: json['entityConfirmed'] as bool? ?? false,
        status: json['status'] as int? ?? 0,
        balance: double.tryParse(json['balance']?.toString() ?? '0') ?? 0.0,
        createdAt: json['createdAt'] as String? ?? '',
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'firstName': firstName,
        'lastName': lastName,
        'email': email,
        'dni': dni,
        'sex': sex,
        'dateOfBirth': dateOfBirth,
        'userType': userType,
        'emailConfirmed': emailConfirmed,
        'entityConfirmed': entityConfirmed,
        'status': status,
        'balance': balance,
        'createdAt': createdAt,
      };
}
