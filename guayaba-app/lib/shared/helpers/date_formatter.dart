import 'package:intl/intl.dart';

/// Centralized date formatting helpers.
class DateFormatter {
  DateFormatter._();

  // ─── Parse any date string to DateTime ─────
  /// Tries multiple common formats and returns null if unparseable.
  static DateTime? tryParse(String? raw) {
    if (raw == null || raw.isEmpty) return null;

    // ISO 8601 first (most common from APIs)
    final iso = DateTime.tryParse(raw);
    if (iso != null) return iso;

    final formats = [
      'dd/MM/yyyy',
      'dd-MM-yyyy',
      'MM/dd/yyyy',
      'yyyy/MM/dd',
      'dd.MM.yyyy',
      'd/M/yyyy',
      'dd/MM/yyyy HH:mm:ss',
      'yyyy-MM-ddTHH:mm:ss',
    ];

    for (final fmt in formats) {
      try {
        return DateFormat(fmt).parseStrict(raw);
      } catch (_) {}
    }

    return null;
  }

  // ─── Format functions ──────────────────────

  /// `23/03/2026`
  static String toDMY(dynamic date) {
    final dt = _resolve(date);
    if (dt == null) return '';
    return DateFormat('dd/MM/yyyy').format(dt);
  }

  /// `03/23/2026`
  static String toMDY(dynamic date) {
    final dt = _resolve(date);
    if (dt == null) return '';
    return DateFormat('MM/dd/yyyy').format(dt);
  }

  /// `2026-03-23`
  static String toISO(dynamic date) {
    final dt = _resolve(date);
    if (dt == null) return '';
    return DateFormat('yyyy-MM-dd').format(dt);
  }

  /// `23 Mar 2026`
  static String toShort(dynamic date) {
    final dt = _resolve(date);
    if (dt == null) return '';
    return DateFormat('dd MMM yyyy').format(dt);
  }

  /// `23 de marzo de 2026`
  static String toLong(dynamic date) {
    final dt = _resolve(date);
    if (dt == null) return '';
    return DateFormat("dd 'de' MMMM 'de' yyyy").format(dt);
  }

  /// `23/03/2026 14:30`
  static String toDMYTime(dynamic date) {
    final dt = _resolve(date);
    if (dt == null) return '';
    return DateFormat('dd/MM/yyyy HH:mm').format(dt);
  }

  /// `Hace 3 días`, `Hace 2 horas`, etc.
  static String toRelative(dynamic date) {
    final dt = _resolve(date);
    if (dt == null) return '';
    final diff = DateTime.now().difference(dt);

    if (diff.inDays > 365) return 'Hace ${diff.inDays ~/ 365} año${diff.inDays ~/ 365 > 1 ? 's' : ''}';
    if (diff.inDays > 30) return 'Hace ${diff.inDays ~/ 30} mes${diff.inDays ~/ 30 > 1 ? 'es' : ''}';
    if (diff.inDays > 0) return 'Hace ${diff.inDays} día${diff.inDays > 1 ? 's' : ''}';
    if (diff.inHours > 0) return 'Hace ${diff.inHours} hora${diff.inHours > 1 ? 's' : ''}';
    if (diff.inMinutes > 0) return 'Hace ${diff.inMinutes} min';
    return 'Ahora';
  }

  // ─── Internal resolver ─────────────────────
  static DateTime? _resolve(dynamic date) {
    if (date == null) return null;
    if (date is DateTime) return date;
    if (date is String) return tryParse(date);
    return null;
  }
}
