#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
mod chacha_crypt;
use chacha_crypt::run_cha_cha;
fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![process_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn process_file(file_name: String, file_password: String) -> String {
    match run_cha_cha(file_name, file_password) {
        Ok(()) => "SUCCESS: File processing completed successfully".to_string(),
        Err(error) => {
            format!("ERROR: {}", error)
        }
    }
}
